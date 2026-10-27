import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Building,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Truck,
  Lock,
} from 'lucide-react';
import { useStore, formatNaira } from '../store/useStore';
import { NIGERIAN_STATES } from '../data/products';
import { OrderRecord, OrderAddress } from '../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, promoCode, discountPercentage, addOrder, user } = useStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Customer Info
  const [customerInfo, setCustomerInfo] = useState({
    fullName: user.name || 'Chiemeka Davies',
    email: user.email || 'c.davies@example.com',
    phone: user.phone || '+234 803 555 0192',
  });

  // Step 2: Delivery Info
  const [deliveryInfo, setDeliveryInfo] = useState<OrderAddress>({
    fullName: user.name || 'Chiemeka Davies',
    email: user.email || 'c.davies@example.com',
    phone: user.phone || '+234 803 555 0192',
    street: user.addresses[0]?.street || '14 Admiralty Way, Lekki Phase 1',
    city: user.addresses[0]?.city || 'Lagos',
    state: user.addresses[0]?.state || 'Lagos',
    notes: 'Please call recipient when dispatch rider is within vicinity.',
  });

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer'>('card');

  // Error validation
  const [formError, setFormError] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const freeShippingThreshold = 100000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = subtotal > 0 ? (isFreeShipping ? 0 : deliveryInfo.state === 'Lagos' ? 3500 : 6500) : 0;
  const total = subtotal - discountAmount + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display font-semibold text-xl text-neutral-900">
          Your bag is empty
        </h2>
        <p className="text-xs text-neutral-500 mt-2">
          Add pieces to your bag before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-block mt-5 bg-[#171717] text-white text-xs font-semibold py-3 px-6"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const validateStep1 = () => {
    if (!customerInfo.fullName.trim()) return 'Please enter your full name.';
    if (!customerInfo.email.includes('@')) return 'Please provide a valid email address.';
    if (!customerInfo.phone.trim()) return 'Please provide a contact phone number.';
    return '';
  };

  const validateStep2 = () => {
    if (!deliveryInfo.street.trim()) return 'Please enter your delivery street address.';
    if (!deliveryInfo.city.trim()) return 'Please enter your city.';
    if (!deliveryInfo.state.trim()) return 'Please select your delivery state.';
    return '';
  };

  const handleNextStep = () => {
    setFormError('');
    if (currentStep === 1) {
      const err = validateStep1();
      if (err) {
        setFormError(err);
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const err = validateStep2();
      if (err) {
        setFormError(err);
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handlePlaceSimulatedOrder = () => {
    const orderRef = `TOOO-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];

    const newOrder: OrderRecord = {
      orderReference: orderRef,
      date: formattedDate,
      items: cart.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        size: i.selectedSize,
        colour: i.selectedColour,
        quantity: i.quantity,
        price: i.unitPrice,
        image: i.product.images[0],
      })),
      subtotal,
      shippingFee,
      discount: discountAmount,
      total,
      address: deliveryInfo,
      paymentMethod: paymentMethod === 'card' ? 'Card (Demo)' : 'Bank Transfer (Demo)',
      paymentStatus: 'Simulated Paid',
      deliveryStatus: 'Confirmed',
      timeline: [
        {
          status: 'Order Placed',
          timestamp: `${formattedDate} · Just Now`,
          completed: true,
          description: `Order ${orderRef} recorded in client portal (Prototype Simulation)`,
        },
        {
          status: 'Confirmed',
          timestamp: `${formattedDate} · Verified`,
          completed: true,
          description: 'Payment verified and allocated to atelier cutting table',
        },
        {
          status: 'Processing',
          timestamp: 'Scheduled for tomorrow',
          completed: false,
          description: 'Garments steamed, wrapped in recycled tissue, and boxed',
        },
        {
          status: 'Shipped',
          timestamp: 'Pending Dispatch',
          completed: false,
          description: 'Courier dispatch handover with live SMS tracking',
        },
        {
          status: 'Delivered',
          timestamp: 'Pending Delivery',
          completed: false,
          description: 'Doorstep signature confirmation',
        },
      ],
    };

    addOrder(newOrder);
    clearCart();
    navigate(`/track-order?ref=${orderRef}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Top Banner Notice */}
      <div className="mb-8 p-3.5 bg-[#F6F3ED] border border-[#E9E7E3] text-xs text-neutral-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#8A4735]" />
          <span>
            <strong>Simulated Checkout:</strong> Designed for future Paystack / Flutterwave integration. No real financial credentials collected.
          </span>
        </div>
        <Link to="/cart" className="text-neutral-500 hover:text-neutral-900 underline text-xs">
          Return to Bag
        </Link>
      </div>

      {/* Checkout Steps Progress Header */}
      <div className="mb-10 max-w-2xl">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-neutral-400">
          <span className={currentStep >= 1 ? 'text-[#171717]' : ''}>1. Client Info</span>
          <span className="text-neutral-300">──</span>
          <span className={currentStep >= 2 ? 'text-[#171717]' : ''}>2. Delivery</span>
          <span className="text-neutral-300">──</span>
          <span className={currentStep >= 3 ? 'text-[#171717]' : ''}>3. Payment</span>
          <span className="text-neutral-300">──</span>
          <span className={currentStep === 4 ? 'text-[#171717]' : ''}>4. Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form Flow */}
        <div className="lg:col-span-7 bg-white border border-[#E9E7E3] p-6 sm:p-8">
          {formError && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* STEP 1: Customer Information */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display font-semibold text-lg text-neutral-900">
                  Step 1: Client Information
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  We use this for order receipts, tracking dispatches, and delivery coordination.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-neutral-800 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.fullName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E9E7E3] p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                    placeholder="e.g. Chiemeka Davies"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-800 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E9E7E3] p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                    placeholder="c.davies@example.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-800 block mb-1">
                    Phone Number (Nigeria) *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E9E7E3] p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                    placeholder="+234 803 555 0192"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery Details */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display font-semibold text-lg text-neutral-900">
                  Step 2: Delivery Address
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Handled via dedicated insured couriers across all Nigerian states.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-neutral-800 block mb-1">
                    Street Address & Apartment / Unit *
                  </label>
                  <input
                    type="text"
                    value={deliveryInfo.street}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, street: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E9E7E3] p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                    placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-800 block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.city}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#E9E7E3] p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                      placeholder="e.g. Lagos"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-800 block mb-1">
                      State (Nigeria) *
                    </label>
                    <select
                      value={deliveryInfo.state}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, state: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#E9E7E3] p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                    >
                      {NIGERIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-800 block mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryInfo.notes}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, notes: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E9E7E3] p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                    placeholder="Gate code, specific landmarks, or receiving preferences..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display font-semibold text-lg text-neutral-900">
                  Step 3: Payment Selection
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Select payment route. Production payment gateway integration pending.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <label
                  className={`p-4 border block cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#171717] bg-[#FAF8F5] ring-1 ring-[#171717]'
                      : 'border-[#E9E7E3] bg-white hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mt-1 accent-[#171717]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-neutral-800" />
                        <span className="text-xs font-semibold text-neutral-900">
                          Debit / Credit Card (Paystack / Flutterwave)
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1">
                        Integration pending. In this prototype, orders proceed directly through demonstration simulation without requesting card credentials.
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  className={`p-4 border block cursor-pointer transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-[#171717] bg-[#FAF8F5] ring-1 ring-[#171717]'
                      : 'border-[#E9E7E3] bg-white hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-1 accent-[#171717]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-neutral-800" />
                        <span className="text-xs font-semibold text-neutral-900">
                          Direct Bank Transfer / Virtual Account
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1">
                        Instant automated transfer matching via dedicated Nigerian NIP rails.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: Review Order */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-semibold text-lg text-neutral-900">
                  Step 4: Final Order Review
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Confirm recipient and dispatch information prior to generating your order reference.
                </p>
              </div>

              <div className="bg-[#FAF8F5] border border-[#E9E7E3] p-4 text-xs space-y-3">
                <div className="flex justify-between items-start pb-2 border-b border-[#E9E7E3]">
                  <div>
                    <span className="font-semibold text-neutral-800 block">Client:</span>
                    <span className="text-neutral-600">{customerInfo.fullName} ({customerInfo.phone})</span>
                    <span className="text-neutral-500 block">{customerInfo.email}</span>
                  </div>
                  <button onClick={() => setCurrentStep(1)} className="text-[#8A4735] hover:underline font-medium">
                    Edit
                  </button>
                </div>

                <div className="flex justify-between items-start pb-2 border-b border-[#E9E7E3]">
                  <div>
                    <span className="font-semibold text-neutral-800 block">Delivery Destination:</span>
                    <span className="text-neutral-600">{deliveryInfo.street}, {deliveryInfo.city}, {deliveryInfo.state}</span>
                  </div>
                  <button onClick={() => setCurrentStep(2)} className="text-[#8A4735] hover:underline font-medium">
                    Edit
                  </button>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-neutral-800 block">Payment Method:</span>
                    <span className="text-neutral-600">
                      {paymentMethod === 'card' ? 'Card Checkout (Simulated Demo)' : 'Bank Transfer (Simulated Demo)'}
                    </span>
                  </div>
                  <button onClick={() => setCurrentStep(3)} className="text-[#8A4735] hover:underline font-medium">
                    Edit
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-neutral-900 text-neutral-300 text-xs rounded space-y-1">
                <p className="font-semibold text-white">Prototype Model Confirmation</p>
                <p className="text-[11px] leading-relaxed">
                  Clicking "Confirm & Place Order" creates a persistent simulated order record with live tracking reference (TOOO-XXXXX) in your browser.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-[#E9E7E3] flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep((currentStep - 1) as any)}
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <Link
                to="/cart"
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Bag</span>
              </Link>
            )}

            {currentStep < 4 ? (
              <button
                onClick={handleNextStep}
                className="bg-[#171717] hover:bg-neutral-800 text-white font-semibold text-xs py-3 px-6 transition-colors flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handlePlaceSimulatedOrder}
                className="bg-[#8A4735] hover:bg-[#723929] text-white font-semibold text-xs uppercase tracking-wider py-3.5 px-8 transition-colors flex items-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Place Order</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Order Items Summary */}
        <div className="lg:col-span-5 bg-[#FDFBF7] border border-[#E9E7E3] p-6 space-y-5">
          <h3 className="font-display font-semibold text-base text-neutral-900 pb-3 border-b border-[#E9E7E3]">
            Order Items ({cart.reduce((c, i) => c + i.quantity, 0)})
          </h3>

          <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3 items-center text-xs">
                <div className="w-14 aspect-[3/4] bg-[#F6F3ED] overflow-hidden shrink-0 border border-[#E9E7E3]">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-neutral-900 truncate">{item.product.name}</h4>
                  <p className="text-[11px] text-neutral-500">
                    {item.selectedSize} · {item.selectedColour} · Qty {item.quantity}
                  </p>
                </div>
                <span className="font-semibold text-neutral-900 tabular-nums">
                  {formatNaira(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E9E7E3] space-y-2 text-xs text-neutral-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium tabular-nums">{formatNaira(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Special Privilege ({promoCode})</span>
                <span className="tabular-nums">-{formatNaira(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery ({deliveryInfo.state})</span>
              <span className="font-medium tabular-nums">
                {shippingFee === 0 ? 'Complimentary' : formatNaira(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-neutral-900 pt-3 border-t border-[#E9E7E3]">
              <span>Grand Total</span>
              <span className="font-display tabular-nums">{formatNaira(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
