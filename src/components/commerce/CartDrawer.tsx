import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useStore, formatNaira } from '../../store/useStore';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    promoCode,
    discountPercentage,
    applyPromoCode,
    removePromoCode,
  } = useStore();

  const [inputCode, setInputCode] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const freeShippingThreshold = 100000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = subtotal > 0 ? (isFreeShipping ? 0 : 5000) : 0;
  const finalTotal = subtotal - discountAmount + shippingFee;

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

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl z-10">
        {/* Header */}
        <div className="p-5 border-b border-[#E9E7E3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-800" />
            <h2 className="font-display font-semibold text-lg text-[#171717]">
              Shopping Bag
            </h2>
            <span className="text-xs text-[#77746F] tabular-nums font-medium">
              ({cart.reduce((c, i) => c + i.quantity, 0)} {cart.length === 1 ? 'item' : 'items'})
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
            aria-label="Close bag drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#F6F3ED] px-5 py-3 border-b border-[#E9E7E3] text-xs">
          {isFreeShipping ? (
            <p className="font-medium text-[#171717] flex items-center gap-1.5">
              <span className="text-emerald-700">✓</span> You have unlocked complimentary Nigerian shipping.
            </p>
          ) : (
            <div>
              <p className="text-neutral-700">
                Add <span className="font-semibold text-neutral-900">{formatNaira(remainingForFreeShipping)}</span> more for complimentary Lagos delivery.
              </p>
              <div className="w-full bg-[#E9E7E3] h-1.5 mt-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#171717] h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-neutral-500">
              <div className="w-16 h-16 rounded-full bg-[#F6F3ED] flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-neutral-400" />
              </div>
              <h3 className="font-display font-medium text-base text-neutral-800">
                Your bag is empty
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                Explore our latest contemporary silhouettes, outerwear and essential pieces.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  navigate('/shop');
                }}
                className="mt-6 bg-[#171717] text-white text-xs font-semibold py-3 px-6 hover:bg-neutral-800 transition-colors"
              >
                Discover Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-4 border-b border-[#E9E7E3] last:border-b-0"
              >
                {/* Item Thumbnail */}
                <Link
                  to={`/product/${item.product.slug}`}
                  onClick={closeCart}
                  className="w-20 aspect-[3/4] bg-[#F6F3ED] shrink-0 overflow-hidden relative"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Item Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${item.product.slug}`}
                        onClick={closeCart}
                        className="font-medium text-sm text-[#171717] hover:text-[#8A4735] transition-colors leading-tight line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-rose-600 transition-colors p-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Variant specs (Size & Colour) */}
                    <div className="mt-1 flex items-center gap-2 text-xs text-[#77746F]">
                      <span>Size: <strong className="text-neutral-800 font-medium">{item.selectedSize}</strong></span>
                      <span>·</span>
                      <span>Colour: <strong className="text-neutral-800 font-medium">{item.selectedColour}</strong></span>
                    </div>

                    <div className="mt-1 text-xs font-semibold text-[#171717] tabular-nums">
                      {formatNaira(item.unitPrice)}
                    </div>
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-[#E9E7E3] bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-medium tabular-nums text-neutral-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-semibold text-xs text-[#171717] tabular-nums">
                      {formatNaira(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#E9E7E3] bg-[#FDFBF7] space-y-4">
            {/* Promo Code Form */}
            <div>
              {promoCode ? (
                <div className="flex items-center justify-between bg-white border border-[#E9E7E3] px-3 py-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#8A4735]" />
                    <span className="font-medium text-neutral-800">{promoCode}</span>
                    <span className="text-emerald-700 font-semibold">({discountPercentage}% Off)</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-neutral-400 hover:text-rose-600 text-xs font-medium"
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
                    placeholder="Promo code (e.g. TOOO10)"
                    className="flex-1 bg-white border border-[#E9E7E3] px-3 py-2 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 uppercase"
                  />
                  <button
                    type="submit"
                    className="bg-neutral-800 text-white text-xs px-3 py-2 font-medium hover:bg-neutral-900 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && (
                <p className="text-[11px] text-rose-500 mt-1">{promoError}</p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-900 tabular-nums">{formatNaira(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Special Privilege ({promoCode})</span>
                  <span className="font-medium tabular-nums">-{formatNaira(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-medium text-neutral-900 tabular-nums">
                  {shippingFee === 0 ? 'Complimentary' : formatNaira(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-neutral-900 pt-2 border-t border-[#E9E7E3]">
                <span>Total</span>
                <span className="tabular-nums font-display">{formatNaira(finalTotal)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleCheckoutClick}
                className="w-full bg-[#171717] hover:bg-neutral-800 text-white font-medium py-3 px-4 text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="hover:text-neutral-900 underline underline-offset-2"
                >
                  View full cart details
                </Link>
                <span className="flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                  Secure Checkout
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
