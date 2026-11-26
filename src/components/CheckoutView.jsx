import React, { useState } from 'react';
import { formatINR } from '../utils/currency';

export const CheckoutView = ({
  items,
  userMeasurements,
  onBack,
  onCompleteOrder
}) => {
  const [activeStep, setActiveStep] = useState('summary'); // 'summary' | 'address' | 'payment'

  // Shipping Form State
  const [address, setAddress] = useState({
    fullName: 'David Silva',
    email: 'david.silva@footballmail.com',
    phone: '+44 7911 123456',
    street: '10 Wembley Way',
    apartment: 'Apt 4B',
    city: 'London',
    postalCode: 'HA9 0WS',
    country: 'United Kingdom'
  });

  // Payment Form State
  
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = 0.0; // Complimentary express sports delivery
  const finalTotal = subtotal - discountAmount + shippingFee;

  const applyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'VAMOS10' || promoCode.trim().toUpperCase() === 'EXPECTO10') {
      setDiscountPercent(10);
      setPromoMessage('Promo code applied! 10% off entire boot order.');
    } else {
      setPromoMessage('Invalid coupon code. Try "VAMOS10" or "EXPECTO10".');
    }
  };

  const handleSubmitOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onCompleteOrder({
        items,
        total: finalTotal,
        address,
        paymentMethod: 'Demo — no payment collected',
        orderId: `ES-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header and Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Catalog
        </button>

        <div className="text-right">
          <span className="text-[10px] font-mono uppercase text-sky-400 tracking-wider">
            DEMO CHECKOUT
          </span>
          <h2 className="text-xl font-bold text-white">Expecto Soleum Dispatch</h2>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: 'summary', step: '1', title: 'Order Summary' },
          { id: 'address', step: '2', title: 'Shipping Address' },
          { id: 'payment', step: '3', title: 'Demo Confirmation' }
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveStep(s.id)}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeStep === s.id
                ? 'bg-sky-950/70 border-sky-500/80 shadow-lg shadow-sky-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                activeStep === s.id ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {s.step}
              </span>
              <span className="text-xs font-bold text-white">{s.title}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Grid: Steps Content vs Sticky Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Step Views (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: ORDER SUMMARY */}
          {activeStep === 'summary' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  Order Summary & Boot Specs
                </h3>
                <span className="text-xs font-mono text-slate-400">{items.length} item(s)</span>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize}`}
                    className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl flex gap-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg bg-slate-900"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">
                            {item.brand} • {item.surface}
                          </span>
                          <span className="text-sm font-bold text-white font-mono">
                            {formatINR(item.price)}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{item.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{item.colorway}</p>
                      </div>

                      {/* Biometric verification stamp */}
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/60 text-xs font-mono">
                        <span className="px-2 py-0.5 bg-sky-950 text-sky-300 border border-sky-800 rounded">
                          Calibrated Size: EU {item.selectedSize}
                        </span>
                        <span className="text-[11px] text-emerald-400">
                          ✓ Tailored for {userMeasurements.widthCm}cm width
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Complimentary Player Kit Perks */}
              <div className="p-3 bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-900/40 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-base">🎁</span>
                  <span>Free Expecto Soleum Breathable Boot Bag & Match Laces</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold">{formatINR(0)}</span>
              </div>

              <button
                onClick={() => setActiveStep('address')}
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue to Shipping Address</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* STEP 2: SHIPPING ADDRESS */}
          {activeStep === 'address' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  Delivery & Shipping Address
                </h3>
                <span className="text-xs font-mono text-emerald-400">Matchday Express</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Full Player Name</label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Email for Tracking Updates</label>
                  <input
                    type="email"
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Phone Number (Courier SMS)</label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Country</label>
                  <input
                    type="text"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500 font-medium"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-slate-400 font-mono block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono block mb-1">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Postal / Zip Code</label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  onClick={() => setActiveStep('summary')}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={() => setActiveStep('payment')}
                  className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <span>Continue to Demo Confirmation</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DEMO ORDER CONFIRMATION */}
          {activeStep === 'payment' && (
            <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-6 shadow-xl space-y-5 animate-fadeIn">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧪</span>
                <div>
                  <h3 className="text-base font-bold text-white">Demo checkout</h3>
                  <p className="text-xs text-amber-300">This is a product demonstration, not a live store.</p>
                </div>
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-sm text-slate-200 space-y-2">
                <p className="font-bold text-amber-200">No payment will be taken.</p>
                <p>No card details, CVV, wallet credentials or real payment information are needed. This button only creates a simulated order reference inside the demo.</p>
                <p className="text-xs text-slate-400">The displayed total is an estimated product value, not an amount charged. No real courier dispatch or delivery is arranged.</p>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-800 pt-4">
                <span className="text-slate-400">Demo order value</span>
                <strong className="text-white">{formatINR(finalTotal)}</strong>
              </div>
              <div className="pt-2 flex gap-3">
                <button onClick={() => setActiveStep('address')} className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">Back</button>
                <button onClick={handleSubmitOrder} disabled={isSubmitting} className="flex-1 py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 font-bold text-slate-950 text-sm shadow-xl transition-all">
                  {isSubmitting ? 'CREATING DEMO ORDER…' : 'CREATE DEMO ORDER'}
                </button>
              </div>
            </div>
          )}
        {/* Right Column: Sticky Summary & Promo Code (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 sticky top-24">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3">
              Demo Order Estimate
            </h3>

            {/* Price lines */}
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Items Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Discount ({discountPercent}%)</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-300">
                <span>Matchday Courier Delivery</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Expecto Soleum Precision Fit Guarantee</span>
                <span className="text-sky-400">INCLUDED</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline text-white">
                <span className="text-sm font-sans font-bold">Total Due</span>
                <span className="text-2xl font-black text-sky-400 font-mono">
                  {formatINR(finalTotal)}
                </span>
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={applyPromo} className="pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (e.g. VAMOS10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-mono font-bold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p className={`text-[11px] mt-2 font-mono ${
                  discountPercent > 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {promoMessage}
                </p>
              )}
            </form>

            {/* Fit Assurance Guarantee */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-200">
                <span>🛡️</span>
                <span>30-Day Pitch Trial Guarantee</span>
              </div>
              <p>
                Take them out on grass for 30 days. If the width or length causes blistering or pinch points, exchange for another tailored boot free of charge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
