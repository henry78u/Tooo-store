import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, PackageCheck, Clock, CheckCircle2, Truck, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { useStore, formatNaira } from '../store/useStore';

export const OrderTrackingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || 'TOOO-84920';

  const [inputRef, setInputRef] = useState(initialRef);
  const { getOrder, orders } = useStore();

  const [activeOrder, setActiveOrder] = useState(() => getOrder(initialRef) || orders[0]);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setInputRef(ref);
      const found = getOrder(ref);
      if (found) setActiveOrder(found);
    }
  }, [searchParams, getOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.trim()) return;
    const found = getOrder(inputRef.trim());
    if (found) {
      setActiveOrder(found);
      setSearchParams({ ref: found.orderReference });
    } else {
      setActiveOrder(undefined as any);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8A4735] block mb-1">
          Dispatch Status
        </span>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#171717]">
          Order Tracking & Delivery
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Enter your TOOO order reference to track status from atelier tailoring to doorstep dispatch.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-md mx-auto">
          <input
            type="text"
            value={inputRef}
            onChange={(e) => setInputRef(e.target.value)}
            placeholder="e.g. TOOO-84920"
            className="flex-1 bg-white border border-[#E9E7E3] px-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 uppercase tracking-wider focus:outline-none focus:border-neutral-900"
          />
          <button
            type="submit"
            className="bg-[#171717] hover:bg-neutral-800 text-white text-xs font-semibold px-5 py-2.5 transition-colors flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Track</span>
          </button>
        </form>

        {/* Quick Demo Switcher */}
        {orders.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-neutral-500">
            <span>Recent Orders:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.orderReference}
                onClick={() => {
                  setInputRef(o.orderReference);
                  setActiveOrder(o);
                  setSearchParams({ ref: o.orderReference });
                }}
                className="underline hover:text-neutral-900"
              >
                {o.orderReference}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Result Display */}
      {!activeOrder ? (
        <div className="bg-[#FAF8F5] border border-[#E9E7E3] p-10 text-center text-neutral-600">
          <h3 className="font-display font-semibold text-base text-neutral-900">
            Order Reference Not Found
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Could not find an order matching "{inputRef}". Please check your order confirmation email or try TOOO-84920.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Order Header Card */}
          <div className="bg-[#FAF8F5] border border-[#E9E7E3] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-display font-extrabold text-xl text-neutral-900 tracking-tight">
                  {activeOrder.orderReference}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#8A4735] bg-white border border-neutral-200 px-2.5 py-0.5">
                  {activeOrder.deliveryStatus}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Placed on {activeOrder.date} · Payment: {activeOrder.paymentMethod}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-neutral-500 block">Total Value</span>
              <span className="font-display font-bold text-lg text-neutral-900 tabular-nums">
                {formatNaira(activeOrder.total)}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-[#E9E7E3] p-6 sm:p-8">
            <h3 className="font-display font-semibold text-base text-neutral-900 mb-6">
              Fulfillment Timeline
            </h3>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E9E7E3]">
              {activeOrder.timeline.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div
                    className={`absolute -left-6 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                      step.completed
                        ? 'border-[#8A4735] bg-[#8A4735] text-white'
                        : 'border-neutral-300'
                    }`}
                  >
                    {step.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4
                        className={`text-xs font-semibold ${
                          step.completed ? 'text-neutral-900' : 'text-neutral-500'
                        }`}
                      >
                        {step.status}
                      </h4>
                      <span className="text-[11px] text-neutral-400 tabular-nums">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items & Delivery Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Items */}
            <div className="bg-white border border-[#E9E7E3] p-6">
              <h3 className="font-display font-semibold text-sm text-neutral-900 mb-4 pb-2 border-b border-[#E9E7E3]">
                Garments in this Shipment
              </h3>
              <div className="space-y-3">
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.image}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="w-12 aspect-[3/4] object-cover bg-neutral-100 border border-[#E9E7E3]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 truncate">{item.productName}</p>
                      <p className="text-neutral-500 text-[11px]">
                        Size: {item.size} · Colour: {item.colour} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-neutral-800 tabular-nums">
                      {formatNaira(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="bg-white border border-[#E9E7E3] p-6 space-y-3 text-xs">
              <h3 className="font-display font-semibold text-sm text-neutral-900 pb-2 border-b border-[#E9E7E3] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#8A4735]" />
                <span>Recipient & Destination</span>
              </h3>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-semibold">
                  Recipient
                </span>
                <p className="font-medium text-neutral-900">{activeOrder.address.fullName}</p>
                <p className="text-neutral-600">{activeOrder.address.phone}</p>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-semibold">
                  Delivery Address
                </span>
                <p className="text-neutral-800">
                  {activeOrder.address.street}, {activeOrder.address.city}, {activeOrder.address.state}
                </p>
              </div>
              {activeOrder.address.notes && (
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-semibold">
                    Courier Notes
                  </span>
                  <p className="text-neutral-600 italic">{activeOrder.address.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
