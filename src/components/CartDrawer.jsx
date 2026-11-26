import React from 'react';
import { formatINR } from '../utils/currency';

export const CartDrawer = ({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onProceedToCheckout }) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-slate-950 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl z-10 animate-slideLeft">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Your Football Boot Bag</h3>
              <p className="text-xs text-slate-400 font-mono">{cart.length} item{cart.length !== 1 ? 's' : ''} in cart</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Cart Item List */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl mb-3">
                ⚽
              </div>
              <p className="text-sm font-semibold text-slate-400">Your boot bag is empty</p>
              <p className="text-xs text-slate-600 mt-1">Select from our precision-matched boots</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}`}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex gap-3 items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg bg-slate-950"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-sky-400 uppercase">
                        {item.brand}
                      </span>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {item.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id, item.selectedSize)}
                      className="text-slate-500 hover:text-rose-400 text-xs transition-colors p-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-slate-300">
                      Size: EU {item.selectedSize}
                    </span>
                    <span className="text-xs font-bold text-white font-mono">
                      {formatINR(item.price)}
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-slate-700 rounded-lg bg-slate-950 text-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                        className="px-2 py-0.5 text-slate-400 hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                        className="px-2 py-0.5 text-slate-400 hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-800 bg-slate-900/50">
            <div className="space-y-2 mb-4 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Matchday Courier</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Expecto Fit Warranty</span>
                <span className="text-emerald-400">INCLUDED</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-800 text-white">
                <span>Total</span>
                <span className="text-sky-400 font-mono">{formatINR(subtotal)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 font-bold text-white text-sm shadow-xl shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Order Summary</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
