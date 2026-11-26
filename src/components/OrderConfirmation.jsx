import React from 'react';
import { formatINR } from '../utils/currency';

export const OrderConfirmation = ({ orderDetails, userMeasurements, onReset }) => {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 animate-fadeIn">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden text-center">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Celebratory Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
          Order Dispatched • Fit Verified
        </span>
        <h2 className="text-3xl lg:text-4xl font-extrabold text-white mt-1">
          Expecto Soleum! Your Boots Are Secured.
        </h2>
        <p className="text-slate-400 text-sm mt-3 max-w-lg mx-auto">
          Thank you for choosing precision biomechanics over guesswork. Your football boots are being pre-conditioned and packed for immediate delivery.
        </p>

        {/* Order Meta Pill */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-around gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">ORDER ID</span>
            <span className="text-sky-400 font-bold text-sm">{orderDetails.orderId}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">TOTAL PAID</span>
            <span className="text-emerald-400 font-bold text-sm">{formatINR(orderDetails.total)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">ESTIMATED ARRIVAL</span>
            <span className="text-white font-bold text-sm">Within 48 Hours</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">PAYMENT METHOD</span>
            <span className="text-white font-bold uppercase">{orderDetails.paymentMethod}</span>
          </div>
        </div>

        {/* Tailored Foot Specs Breakdown */}
        <div className="mt-6 text-left p-5 rounded-2xl bg-slate-950/50 border border-slate-800/80">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <span className="font-mono text-slate-400">Tailored Biometrics Profile:</span>
            <span className="text-sky-400 font-mono font-bold">
              {userMeasurements.lengthCm} cm × {userMeasurements.widthCm} cm
            </span>
          </div>

          <div className="space-y-3 mt-4">
            {orderDetails.items.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-xl bg-slate-900 border border-slate-800"
                />
                <div className="flex-1">
                  <span className="text-[10px] font-mono font-bold text-sky-400 uppercase">
                    {item.brand}
                  </span>
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                    <span>Size: EU {item.selectedSize}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium">Qty: {item.quantity || 1}</span>
                  </div>
                </div>
                <div className="font-mono font-bold text-white text-sm">
                  {formatINR(item.price * (item.quantity || 1))}
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Address Confirmation */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex justify-between items-center text-xs text-slate-400">
            <div>
              <span className="text-slate-300 font-bold block">{orderDetails.address.fullName}</span>
              <span>{orderDetails.address.street}, {orderDetails.address.city} {orderDetails.address.postalCode}</span>
            </div>
            <span className="text-emerald-400 font-mono text-[11px] bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/60">
              Courier SMS Dispatched
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-slate-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Fit Certificate & Receipt
          </button>

          <button
            onClick={onReset}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-blue-600/30 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Scan Another Foot / Restart</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
