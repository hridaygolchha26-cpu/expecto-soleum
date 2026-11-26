import React, { useState } from 'react';
import { calculateBootMatch } from '../utils/fitCalculator';
import { formatINR } from '../utils/currency';

export const ShoeCard = ({ boot, userMeasurements, onAddToCart, onBuyNow, isFavourite = false, onToggleFavourite, onRequestAuth }) => {
  const [selectedSize, setSelectedSize] = useState(userMeasurements.sizeEU || 42.5);
  const [isHovered, setIsHovered] = useState(false);
  const [viewMode, setViewMode] = useState('profile');

  const match = calculateBootMatch(boot, userMeasurements);

  const getMatchBadge = (type) => {
    switch (type) {
      case 'optimal':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'snug':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'warning':
      default:
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10 flex flex-col justify-between"
    >
      <button type="button" aria-label={isFavourite?'Remove from favourites':'Add to favourites'} title={isFavourite?'Remove from favourites':'Add to favourites'} onClick={(event)=>{event.stopPropagation();if(onToggleFavourite)onToggleFavourite(boot.id);else if(onRequestAuth)onRequestAuth();}} className={`absolute top-14 right-3 z-40 w-10 h-10 rounded-full border shadow-xl flex items-center justify-center transition-all ${isFavourite?'bg-rose-500/20 border-rose-400 text-rose-300':'bg-slate-950/90 border-slate-700 text-slate-200 hover:text-rose-300 hover:border-rose-400'}`}><svg className="w-5 h-5" viewBox="0 0 24 24" fill={isFavourite?'currentColor':'none'} stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg></button>
      {/* Top Media & Image Section */}
      <div className="relative h-56 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 flex items-center justify-center overflow-hidden">
        {/* Background Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

        {/* Brand Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-white border border-slate-800">
            {boot.brand}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-sky-950/70 text-sky-400 border border-sky-800/60">
            {boot.surface}
          </span>
        </div>

        {/* Fit Compatibility Badge */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setViewMode(v => v === 'profile' ? 'studs' : 'profile'); }}
            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[#14171E]/90 text-[#E5B80B] border border-[#2A2F3A] hover:border-[#E5B80B] transition"
          >
            {viewMode === 'profile' ? '⚙️ View Studs' : '👟 View Boot'}
          </button>
          <div className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border backdrop-blur-md flex items-center gap-1.5 ${getMatchBadge(match.statusType)}`}>
            <span>{match.score}% MATCH</span>
          </div>
        </div>

        {/* Football Boot & Studs Dual Image (Instant 0ms Switching) */}
        <div className="relative w-full h-44 flex items-center justify-center">
          <img
            src={boot.image}
            alt={`${boot.name} profile`}
            onError={(e) => {
              if (boot.fallbackImage && e.target.src !== boot.fallbackImage) {
                e.target.src = boot.fallbackImage;
              }
            }}
            className={`absolute inset-0 m-auto max-h-full max-w-full object-contain rounded-xl transition-all duration-200 group-hover:scale-105 ${
              viewMode === 'profile' ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'
            }`}
            decoding="async"
          />
          {boot.imageStuds && (
            <img
              src={boot.imageStuds}
              alt={`${boot.name} studs`}
              onError={(e) => {
                if (boot.fallbackStuds && e.target.src !== boot.fallbackStuds) {
                  e.target.src = boot.fallbackStuds;
                }
              }}
              className={`absolute inset-0 m-auto max-h-full max-w-full object-contain rounded-xl transition-all duration-200 group-hover:scale-105 ${
                viewMode === 'studs' ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'
              }`}
              decoding="async"
            />
          )}
        </div>

        {/* Weight & Width Tag */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex justify-between items-center text-[11px] font-mono text-slate-300 bg-slate-950/75 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800">
          <span>Width: {boot.widthProfile}</span>
          <span className="text-sky-400">{boot.weightGrams}g</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-xs font-mono text-sky-400 uppercase tracking-wider mb-1">
            {boot.edition}
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
            {boot.name}
          </h3>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white font-mono">{formatINR(boot.price)}</span>
            <span className="text-xs text-slate-400">INR • Free Express Shipping</span>
          </div>

          {/* Fit Assessment Bar */}
          <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Tolerance vs Your Foot:</span>
              <span className={`font-semibold ${match.statusType === 'optimal' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {match.status}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  match.score >= 90 ? 'bg-emerald-400' : match.score >= 80 ? 'bg-amber-400' : 'bg-rose-400'
                }`}
                style={{ width: `${match.score}%` }}
              />
            </div>
          </div>

          {/* Size Selector */}
          <div className="mt-4">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
              <span>Select Size:</span>
              <span className="text-sky-400 font-mono">Calibrated: EU {userMeasurements.sizeEU}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-1">
              {boot.sizesAvailable.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-2 py-1 text-xs rounded-md font-mono transition-all ${
                    selectedSize === size
                      ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  EU {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-800">
          <button
            onClick={() => onAddToCart({ ...boot, selectedSize })}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
          >
            <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Add to Cart
          </button>

          <button
            onClick={() => onBuyNow({ ...boot, selectedSize })}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            Direct Buy
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* ========================================================
          HOVER EXPANSION DRAWER: DEEP TECHNICAL SPECIFICATIONS
          (Appears dynamically when user hovers on a shoe)
      ======================================================== */}
      {isHovered && (
        <div className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-md p-5 flex flex-col justify-between animate-fadeIn border-2 border-sky-500/60 rounded-2xl">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-wider">
                  Biometric Inspection
                </span>
                <h4 className="text-base font-bold text-white">{boot.name}</h4>
              </div>
              <div className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${getMatchBadge(match.statusType)}`}>
                {match.score}% MATCH
              </div>
            </div>

            {/* In-depth Specs */}
            <div className="space-y-3 mt-3 text-xs">
              <div>
                <span className="text-slate-400 font-mono text-[11px] block">Upper Construction:</span>
                <p className="text-slate-200 font-medium">{boot.upperMaterial}</p>
              </div>

              <div>
                <span className="text-slate-400 font-mono text-[11px] block">Soleplate & Traction:</span>
                <p className="text-slate-200 font-medium">{boot.soleplateTech}</p>
              </div>

              <div>
                <span className="text-slate-400 font-mono text-[11px] block">Fit & Anatomic Profile:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">{boot.fitNotes}</p>
              </div>

              {/* Endorsed Pro Players */}
              <div>
                <span className="text-slate-400 font-mono text-[11px] block">Worn by Pro Athletes:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {boot.proPlayers.map((player) => (
                    <span key={player} className="px-2 py-0.5 bg-blue-950/70 border border-blue-800/60 text-blue-300 rounded text-[10px] font-semibold">
                      {player}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action from Hover Modal */}
          <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddToCart({ ...boot, selectedSize })}
              className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              + Add to Cart
            </button>
            <button
              onClick={() => onBuyNow({ ...boot, selectedSize })}
              className="py-2 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20"
            >
              Buy Now ({formatINR(boot.price)})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
