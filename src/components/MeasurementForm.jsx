import React from 'react';
import { calculateSizesFromLength, classifyFootWidth } from '../utils/fitCalculator';

export const MeasurementForm = ({ measurements, onChange, onNext }) => {
  const calculatedSizes = calculateSizesFromLength(measurements.lengthCm);
  const widthClassification = classifyFootWidth(measurements.widthCm, measurements.lengthCm);

  const handleLengthChange = (val) => {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const newSizes = calculateSizesFromLength(num);
      onChange({
        ...measurements,
        lengthCm: num,
        sizeEU: newSizes.eu,
        sizeUK: newSizes.uk,
        sizeUS: newSizes.usMen
      });
    }
  };

  const handleWidthChange = (val) => {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      onChange({
        ...measurements,
        widthCm: num
      });
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-2xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-6">
          <div>
            <span className="text-xs font-mono font-semibold tracking-wider text-sky-400 uppercase">
              Step 1 • Precision Biometrics
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
              Calibrate Your Foot Fit
            </h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold font-mono">
            3D
          </div>
        </div>

        <div className="space-y-6">
          {/* FIELD 1: Foot Length */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                Foot Length (Heel-to-Toe)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.1"
                  min="22.0"
                  max="33.0"
                  value={measurements.lengthCm}
                  onChange={(e) => handleLengthChange(e.target.value)}
                  className="w-20 bg-slate-800 border border-slate-700 text-white font-mono font-bold text-center py-1 px-2 rounded-lg text-sm focus:outline-none focus:border-sky-400"
                />
                <span className="text-xs font-mono text-slate-400">cm</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="22.0"
              max="32.5"
              step="0.1"
              value={measurements.lengthCm}
              onChange={(e) => handleLengthChange(e.target.value)}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400 focus:outline-none"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
              <span>22.0 cm (EU 35)</span>
              <span>27.0 cm (EU 42.5)</span>
              <span>32.5 cm (EU 48)</span>
            </div>
          </div>

          {/* FIELD 2: Foot Width */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Metatarsal Forefoot Width
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.1"
                  min="8.0"
                  max="13.0"
                  value={measurements.widthCm}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  className="w-20 bg-slate-800 border border-slate-700 text-white font-mono font-bold text-center py-1 px-2 rounded-lg text-sm focus:outline-none focus:border-emerald-400"
                />
                <span className="text-xs font-mono text-slate-400">cm</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="8.2"
              max="12.5"
              step="0.1"
              value={measurements.widthCm}
              onChange={(e) => handleWidthChange(e.target.value)}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
            />

            {/* Dynamic Width Classification Pill */}
            <div className="mt-3 flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className={`text-xs px-2 py-0.5 rounded-md font-semibold border ${widthClassification.badgeColor}`}>
                {widthClassification.category}
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                {widthClassification.description}
              </p>
            </div>
          </div>

          {/* FIELD 3: Size Recommendation & Unit Selection */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-200">
                Shoe Size (Auto-Calculated)
              </label>
              {/* Size Unit Picker */}
              <div className="flex bg-slate-800/90 p-1 rounded-lg border border-slate-700 text-xs font-mono">
                {['EU', 'UK', 'US'].map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => onChange({ ...measurements, sizeUnit: unit })}
                    className={`px-2 py-0.5 rounded font-medium transition-colors ${
                      measurements.sizeUnit === unit
                        ? 'bg-sky-500 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className={`p-2.5 rounded-xl border transition-all ${
                measurements.sizeUnit === 'EU'
                  ? 'bg-sky-950/60 border-sky-500/50 text-sky-200 ring-1 ring-sky-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}>
                <span className="text-[10px] uppercase font-mono block text-slate-400">EU Sizing</span>
                <span className="text-xl font-bold font-mono">{calculatedSizes.eu}</span>
              </div>
              <div className={`p-2.5 rounded-xl border transition-all ${
                measurements.sizeUnit === 'UK'
                  ? 'bg-sky-950/60 border-sky-500/50 text-sky-200 ring-1 ring-sky-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}>
                <span className="text-[10px] uppercase font-mono block text-slate-400">UK Sizing</span>
                <span className="text-xl font-bold font-mono">{calculatedSizes.uk}</span>
              </div>
              <div className={`p-2.5 rounded-xl border transition-all ${
                measurements.sizeUnit === 'US'
                  ? 'bg-sky-950/60 border-sky-500/50 text-sky-200 ring-1 ring-sky-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}>
                <span className="text-[10px] uppercase font-mono block text-slate-400">US Men</span>
                <span className="text-xl font-bold font-mono">{calculatedSizes.usMen}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Includes +1.0 cm dynamic clearance for explosive sprinting and deceleration.
            </p>
          </div>

          {/* Playing Surface Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Pitch Surface Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'All Pitches' },
                { id: 'FG', label: 'FG (Firm Grass)' },
                { id: 'FG/AG', label: 'FG/AG Hybrid' }
              ].map((surface) => (
                <button
                  key={surface.id}
                  type="button"
                  onClick={() => onChange({ ...measurements, surfaceFilter: surface.id })}
                  className={`py-2 px-2 text-xs rounded-xl font-medium border text-center transition-all ${
                    measurements.surfaceFilter === surface.id
                      ? 'bg-blue-600/30 text-blue-300 border-blue-500/60 shadow-lg shadow-blue-500/10'
                      : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {surface.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ACTION CTA BUTTON: "VAMOS! / LET'S GO / NEXT" */}
      <div className="pt-6 mt-6 border-t border-slate-800/80">
        <button
          onClick={onNext}
          className="group relative w-full py-4 px-6 rounded-xl font-bold text-white text-base overflow-hidden bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:via-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="tracking-wide">VAMOS! MATCH MY FOOTBALL BOOTS</span>
          <svg
            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
        <p className="text-center text-[11px] text-slate-400 mt-2 font-mono">
          Ready to filter {'>'}10 elite boots by anatomical tolerance
        </p>
      </div>
    </div>
  );
};
