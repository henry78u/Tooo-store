import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag, ArrowLeft } from 'lucide-react';
import { useStore, formatNaira } from '../store/useStore';
import { NIGERIAN_STATES } from '../data/products';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    promoCode,
    discountPercentage,
    applyPromoCode,
    removePromoCode,
  } = useStore();

  const [inputCode, setInputCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [selectedState, setSelectedState] = useState('Lagos');

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const freeShippingThreshold = 100000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const baseShippingRate = selectedState === 'Lagos' ? 3500 : 6500;
  const shippingFee = subtotal > 0 ? (isFreeShipping ? 0 : baseShippingRate) : 0;
  const total = subtotal - discountAmount + shippingFee;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromoCode(inputCode);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoError('');
      setInputCode('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-20 h-20 bg-[#F6F3ED] rounded-full mx-auto flex items-center justify-center mb-6">
          <ShoppingBag className="w-8 h-8 text-neutral-400" />
        </div>
        <h1 className="font-display font-bold text-2xl text-neutral-900">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-neutral-500 mt-2 max-w-sm mx-auto">
          Explore our new arrivals and discover pieces tailored to elevate your everyday statement.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 mt-8 bg-[#171717] text-white text-xs font-semibold uppercase tracking-wider py-3.5 px-8 hover:bg-neutral-800 transition-colors"
        >
          <span>Explore The Catalogue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Page Title */}
      <div className="flex items-center justify-between pb-6 border-b border-[#E9E7E3] mb-8">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8A4735] block mb-1">
            Order Review
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#171717]">
            Shopping Bag ({cart.reduce((c, i) => c + i.quantity, 0)})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-neutral-500 hover:text-rose-600 transition-colors"
        >
          Clear all items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Items Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="divide-y divide-[#E9E7E3] border-b border-[#E9E7E3]">
            {cart.map((item) => (
              <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-5 items-start">
                {/* Image */}
                <Link
                  to={`/product/${item.product.slug}`}
                  className="w-24 sm:w-28 aspect-[3/4] bg-[#F6F3ED] overflow-hidden shrink-0 border border-[#E9E7E3]"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between self-stretch">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-[#8A4735] tracking-wider block">
                          {item.product.category}
                        </span>
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="font-display font-semibold text-base text-[#171717] hover:text-[#8A4735] transition-colors"
                        >
                          {item.product.name}
                        </Link>
                      </div>
                      <span className="font-semibold text-sm sm:text-base text-[#171717] tabular-nums">
                        {formatNaira(item.unitPrice * item.quantity)}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-600">
                      <span>Size: <strong className="text-neutral-900 font-medium">{item.selectedSize}</strong></span>
                      <span>·</span>
                      <span>Colour: <strong className="text-neutral-900 font-medium">{item.selectedColour}</strong></span>
                      <span>·</span>
                      <span className="text-neutral-500 tabular-nums font-normal">
                        {formatNaira(item.unitPrice)} each
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="mt-4 flex items-center justify-between pt-2">
                    <div className="flex items-center border border-[#E9E7E3] bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-semibold tabular-nums text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-neutral-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 bg-[#FDFBF7] border border-[#E9E7E3] p-6 lg:p-8 space-y-6 lg:sticky lg:top-24">
          <h2 className="font-display font-semibold text-lg text-neutral-900 pb-3 border-b border-[#E9E7E3]">
            Order Summary
          </h2>

          {/* Destination Selector for Accurate Shipping */}
          <div>
            <label className="text-xs font-semibold text-neutral-800 block mb-1.5">
              Estimate Delivery State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-white border border-[#E9E7E3] p-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
            >
              {NIGERIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state} {state === 'Lagos' ? '(Atelier Local)' : '(Interstate)'}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-neutral-500 mt-1">
              Complimentary delivery on Nigerian orders ₦100,000 and above.
            </p>
          </div>

          {/* Promo Code Form */}
          <div>
            {promoCode ? (
              <div className="flex items-center justify-between bg-white border border-[#E9E7E3] p-3 text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#8A4735]" />
                  <span className="font-semibold text-neutral-900">{promoCode}</span>
                  <span className="text-emerald-700 font-bold">({discountPercentage}% Off)</span>
                </div>
                <button
                  onClick={removePromoCode}
                  className="text-xs text-neutral-400 hover:text-rose-600"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Code (e.g. TOOO10)"
                  className="flex-1 bg-white border border-[#E9E7E3] px-3 py-2 text-xs uppercase placeholder-neutral-400 focus:outline-none focus:border-neutral-900"
                />
                <button
                  type="submit"
                  className="bg-[#171717] text-white text-xs font-semibold px-4 py-2 hover:bg-neutral-800 transition-colors"
                >
                  Apply
                </button>
              </form>
            )}
            {promoError && <p className="text-[11px] text-rose-500 mt-1">{promoError}</p>}
          </div>

          {/* Summary Math */}
          <div className="space-y-2.5 text-xs text-neutral-700 pt-3 border-t border-[#E9E7E3]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-neutral-900 tabular-nums">{formatNaira(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Special Privilege ({promoCode})</span>
                <span className="tabular-nums">-{formatNaira(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery ({selectedState})</span>
              <span className="font-medium text-neutral-900 tabular-nums">
                {shippingFee === 0 ? 'Complimentary' : formatNaira(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-neutral-900 pt-3 border-t border-[#E9E7E3]">
              <span>Estimated Total</span>
              <span className="font-display tabular-nums">{formatNaira(total)}</span>
            </div>
          </div>

          {/* Primary Proceed CTA */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-[#171717] hover:bg-neutral-800 text-white font-semibold text-xs uppercase tracking-wider py-4 px-6 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Encrypted Checkout Protocol · Prototype Model</span>
          </div>
        </div>
      </div>
    </div>
  );
};
