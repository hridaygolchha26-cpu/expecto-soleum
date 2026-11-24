import React from 'react';

export const Navbar = ({ currentStep, onNavigateStep, cartCount, onOpenCart }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          onClick={() => onNavigateStep('measure')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Logo icon */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
            <span className="text-xl">⚡</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-white group-hover:text-sky-300 transition-colors uppercase">
                Expecto Soleum
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                PRO FIT
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              3D Biometric Football Boot Precision Engine
            </p>
          </div>
        </div>

        {/* Step Navigation Pill */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl text-xs font-mono">
          <button
            onClick={() => onNavigateStep('measure')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 ${
              currentStep === 'measure'
                ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-bold">
              1
            </span>
            <span>3D Foot Scan</span>
          </button>

          <span className="text-slate-600">/</span>

          <button
            onClick={() => onNavigateStep('catalog')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 ${
              currentStep === 'catalog'
                ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-bold">
              2
            </span>
            <span>Matched Boots</span>
          </button>

          <span className="text-slate-600">/</span>

          <button
            onClick={() => onNavigateStep('checkout')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 ${
              currentStep === 'checkout'
                ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-bold">
              3
            </span>
            <span>Summary & Dispatch</span>
          </button>
        </nav>

        {/* Cart Button on Top Right */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-2.5 group"
            title="Open Boot Bag"
          >
            <div className="relative">
              <svg className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-sky-500/40 animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-mono font-bold text-slate-300">
              Cart {cartCount > 0 && `(${cartCount})`}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
