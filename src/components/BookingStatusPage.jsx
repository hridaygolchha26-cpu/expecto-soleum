import React from 'react';
import { formatINR } from '../utils/currency';

export const BookingStatusPage = ({ order, measurements, onRestart, onBackToCatalog }) => {
  const items = order?.items || [];
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 animate-fadeIn">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-300 flex items-center justify-center text-3xl font-black mx-auto border border-amber-500/30">✓</div>
          <span className="inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider bg-amber-950/50 text-amber-300 border border-amber-500/30">Demo order created</span>
          <h2 className="text-2xl lg:text-3xl font-black text-white">Your Expecto Soleum demo order</h2>
          <p className="text-sm text-slate-400">Reference: <strong className="text-amber-300">{order?.orderId || 'Not available'}</strong></p>
        </div>
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-sm space-y-1">
          <p className="font-bold text-amber-200">Demo only — ₹0 charged</p>
          <p className="text-slate-300">This order is simulated. No payment was collected, no courier was booked, and no physical product is being dispatched.</p>
        </div>
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-5 space-y-4">
          <h3 className="font-bold text-white">Order summary</h3>
          {items.map((item, index) => (
            <div key={item.id || index} className="flex items-center gap-3 border-b border-slate-800 pb-3">
              {item.image && <img src={item.image} alt={item.name || 'Football boot'} className="w-16 h-16 rounded-lg object-cover bg-slate-900" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{item.name || 'Football boot'}</p>
                <p className="text-xs text-slate-400">Size {item.selectedSize ?? '—'} · Qty {item.quantity || 1}</p>
              </div>
              <span className="text-sm text-white">{formatINR((Number(item.price) || 0) * (item.quantity || 1))}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm"><span className="text-slate-400">Estimated order value (not charged)</span><strong className="text-white">{formatINR(order?.total || 0)}</strong></div>
          <div className="flex justify-between text-sm"><span className="text-slate-400">Amount paid</span><strong className="text-emerald-300">{formatINR(0)}</strong></div>
          {order?.address?.city && <p className="text-xs text-slate-500 border-t border-slate-800 pt-3">Demo destination entered: {order.address.city}, {order.address.country}</p>}
          {measurements && <p className="text-xs text-slate-500">Fit profile used: {measurements.lengthCm} cm length × {measurements.widthCm} cm width</p>}
        </div>
        <p className="text-xs text-slate-500 text-center">{order?.id ? 'This demo order is saved to your signed-in account. Find it under My Account → Demo order history.' : 'This demo reference is temporary and is not saved to an account.'}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onBackToCatalog} className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold">Back to boot catalogue</button>
          <button onClick={onRestart} className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black">Start another fit</button>
        </div>
      </div>
    </div>
  );
};
