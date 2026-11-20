import React from 'react';

export const BookingStatusPage = ({ order, measurements, onRestart, onBackToCatalog }) => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-fadeIn space-y-6">
      <div className="bg-[#1A1D24] border-2 border-[#2A2F3A] rounded-3xl p-6 lg:p-8 shadow-2xl text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-[#1B4D3E] text-[#34D399] flex items-center justify-center text-3xl font-black mx-auto mb-3 shadow-lg border border-[#34D399]/40">
          ✓
        </div>
        <span className="text-xs text-[#34D399] uppercase font-bold tracking-widest bg-[#1B4D3E]/30 px-3 py-1 rounded-full border border-[#34D399]/30">
          Booking Confirmed & Dispatched
        </span>
        <h2 className="text-2xl lg:text-3xl font-black text-[#F4F1EA] mt-2">
          Football Studs Order Tracking
        </h2>
        <p className="text-xs text-[#A0A6B1] font-mono-num mt-1">
          Tracking ID: <strong className="text-[#E5B80B]">{order.orderId}</strong> • Expected: <strong className="text-[#34D399]">{order.expectedDelivery}</strong>
        </p>

        {/* Live Timeline */}
        <div className="mt-8 pt-6 border-t border-[#2A2F3A] text-left">
          <span className="text-[11px] font-bold text-[#E5B80B] uppercase tracking-wider block mb-4">
            Dispatch Status Timeline
          </span>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Order Confirmed & Biometrics Verified', time: 'Today, 2:15 PM', status: 'done', desc: 'Foot Length and Width calibrated with soleplate last.' },
              { step: '2', title: 'Studs Quality Checked & Torque Tested', time: 'Today, 2:45 PM', status: 'done', desc: 'All 14 TPU studs inspected for hardness and zero sole separation.' },
              { step: '3', title: 'Dispatched via Sports Courier (Blue Dart)', time: 'Today, 3:30 PM', status: 'current', desc: 'Air Waybill #BD9821482IN — In transit to sorting hub.' },
              { step: '4', title: 'Out for Pitch Delivery', time: 'Estimated in 48 hrs', status: 'pending', desc: 'Courier agent will contact via SMS prior to doorstep delivery.' }
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                  s.status === 'done'
                    ? 'bg-[#1B4D3E] text-[#34D399] border border-[#34D399]'
                    : s.status === 'current'
                    ? 'bg-[#E5B80B] text-[#0F1115] font-black animate-pulse'
                    : 'bg-[#14171E] text-[#A0A6B1] border border-[#2A2F3A]'
                }`}>
                  {s.status === 'done' ? '✓' : s.step}
                </div>
                <div className="flex-1 pb-3 border-b border-[#2A2F3A]/60">
                  <div className="flex justify-between items-baseline">
                    <h4 className={`text-xs font-bold ${s.status === 'current' ? 'text-[#E5B80B]' : 'text-[#F4F1EA]'}`}>
                      {s.title}
                    </h4>
                    <span className="text-[10px] font-mono-num text-[#A0A6B1]">{s.time}</span>
                  </div>
                  <p className="text-[11px] text-[#A0A6B1] mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="mt-6 p-4 rounded-2xl bg-[#14171E] border border-[#2A2F3A] text-left text-xs font-mono-num space-y-3">
          <div className="flex justify-between border-b border-[#2A2F3A] pb-2">
            <span className="text-[#A0A6B1]">Item Booked:</span>
            <span className="text-[#F4F1EA] font-bold">{order.items[0]?.name || 'Nivia Ashtang Studs'}</span>
          </div>
          <div className="flex justify-between border-b border-[#2A2F3A] pb-2">
            <span className="text-[#A0A6B1]">Selected Size:</span>
            <span className="text-[#E5B80B] font-bold">UK / IND {order.items[0]?.selectedSize || 8}</span>
          </div>
          <div className="flex justify-between border-b border-[#2A2F3A] pb-2">
            <span className="text-[#A0A6B1]">Destination Address:</span>
            <span className="text-[#F4F1EA] font-bold">{order.address.fullName}, {order.address.city} (PIN: {order.address.postalCode})</span>
          </div>
          <div className="flex justify-between border-b border-[#2A2F3A] pb-2">
            <span className="text-[#A0A6B1]">Payment Method:</span>
            <span className="text-[#34D399] font-bold">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-[#A0A6B1]">Amount Paid:</span>
            <span className="text-base font-black text-[#E5B80B]">₹{order.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 rounded-2xl bg-[#14171E] hover:bg-[#0F1115] text-[#F4F1EA] text-xs font-bold border border-[#2A2F3A] hover:border-[#E5B80B] transition"
          >
            🖨️ Print Booking Invoice
          </button>
          <button
            onClick={onRestart}
            className="px-6 py-3 rounded-2xl bg-[#E5B80B] hover:bg-yellow-400 text-[#0F1115] text-xs font-black uppercase tracking-wider transition shadow-lg"
          >
            Scan Another Foot / New Booking
          </button>
        </div>
      </div>
    </div>
  );
};
