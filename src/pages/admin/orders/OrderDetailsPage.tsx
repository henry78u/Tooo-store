import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { formatNaira } from '../../../store/useStore';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  CreditCard,
  User,
  AlertCircle,
  PackageCheck,
} from 'lucide-react';
import { OrderStatus } from '../../../types';

export const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, cancelOrder } = useAdminStore();

  const order = orders.find(
    (o) => o.orderReference.toLowerCase() === id?.toLowerCase()
  );

  const [noteText, setNoteText] = useState('');

  if (!order) {
    return (
      <div className="p-12 text-center text-neutral-500">
        <h3 className="font-display font-semibold text-lg text-neutral-900">
          Order Not Found
        </h3>
        <p className="text-xs text-neutral-500 mt-1">
          No record found matching reference "{id}".
        </p>
        <Link
          to="/admin/orders"
          className="inline-block mt-4 bg-[#171717] text-white text-xs font-semibold py-2 px-4"
        >
          Return to Orders Table
        </Link>
      </div>
    );
  }

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    updateOrderStatus(order.orderReference, newStatus, noteText || undefined);
    setNoteText('');
  };

  const handleCancel = () => {
    if (confirm(`Cancel order ${order.orderReference}?`)) {
      cancelOrder(order.orderReference, 'Cancelled by admin staff');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Link to="/admin/orders" className="hover:text-neutral-900 flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>
      </div>

      <PageHeader
        title={`Order ${order.orderReference}`}
        subtitle={`Placed on ${order.date} · Payment: ${order.paymentMethod}`}
        breadcrumbs={[{ label: 'Orders', href: '/admin/orders' }, { label: order.orderReference }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold"
            >
              Cancel Order
            </button>
            <div className="flex items-center gap-1">
              <StatusBadge status={order.paymentStatus} />
              <StatusBadge status={order.deliveryStatus} showDot />
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items and Timeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Items Table */}
          <div className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-neutral-900 pb-3 border-b border-[#E9E7E3]">
              Garments in Shipment
            </h3>

            <div className="divide-y divide-[#E9E7E3]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="w-12 aspect-[3/4] object-cover bg-neutral-100 border border-[#E9E7E3]"
                    />
                    <div>
                      <h4 className="font-semibold text-xs text-neutral-900">{item.productName}</h4>
                      <p className="text-[11px] text-neutral-500">
                        Size: <strong className="text-neutral-800">{item.size}</strong> · Colour: <strong className="text-neutral-800">{item.colour}</strong>
                      </p>
                      <span className="text-[11px] text-neutral-400 tabular-nums">
                        {formatNaira(item.price)} each
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-neutral-900 tabular-nums block">
                      {formatNaira(item.price * item.quantity)}
                    </span>
                    <span className="text-[11px] text-neutral-500">Qty: {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-[#E9E7E3] space-y-2 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-900 tabular-nums">{formatNaira(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promotional Privilege</span>
                  <span className="font-medium tabular-nums">-{formatNaira(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-medium text-neutral-900 tabular-nums">
                  {order.shippingFee === 0 ? 'Complimentary' : formatNaira(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-[#E9E7E3]">
                <span>Total Value</span>
                <span className="font-display tabular-nums">{formatNaira(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Fulfillment Status Controller */}
          <div className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-neutral-900 pb-3 border-b border-[#E9E7E3]">
              Update Fulfillment Status
            </h3>

            <div className="flex flex-wrap gap-2 text-xs">
              {(['Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'] as OrderStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(st)}
                    className={`px-3 py-1.5 font-semibold border transition-colors ${
                      order.deliveryStatus === st
                        ? 'bg-[#171717] text-white border-[#171717]'
                        : 'bg-white text-neutral-700 border-[#E9E7E3] hover:border-neutral-900'
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>

            <div className="pt-2">
              <label className="text-xs font-semibold text-neutral-800 block mb-1">
                Internal Dispatch Note (Appears in client timeline)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="e.g. Courier tracking code or dispatch rider name..."
                  className="flex-1 p-2 text-xs border border-[#E9E7E3] bg-[#FAF8F5]"
                />
                <button
                  onClick={() => handleUpdateStatus(order.deliveryStatus)}
                  className="px-3 py-2 bg-neutral-900 text-white text-xs font-semibold"
                >
                  Log Note
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="pt-4 border-t border-[#E9E7E3] space-y-4">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                Fulfillment History
              </span>
              <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E9E7E3]">
                {order.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-3 text-xs">
                    <div
                      className={`absolute -left-6 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                        step.completed
                          ? 'border-[#8A4735] bg-[#8A4735] text-white'
                          : 'border-neutral-300'
                      }`}
                    >
                      {step.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900">{step.status}</span>
                        <span className="text-[10px] text-neutral-400 tabular-nums">
                          {step.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Shipping Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Card */}
          <div className="bg-white border border-[#E9E7E3] p-5 space-y-3 text-xs">
            <h3 className="font-display font-bold text-sm text-neutral-900 pb-2 border-b border-[#E9E7E3] flex items-center gap-2">
              <User className="w-4 h-4 text-[#8A4735]" />
              <span>Customer Details</span>
            </h3>
            <div>
              <span className="text-neutral-400 text-[10px] uppercase font-semibold">Name</span>
              <p className="font-semibold text-neutral-900">{order.address.fullName}</p>
            </div>
            <div>
              <span className="text-neutral-400 text-[10px] uppercase font-semibold">Email</span>
              <p className="text-neutral-700">{order.address.email}</p>
            </div>
            <div>
              <span className="text-neutral-400 text-[10px] uppercase font-semibold">Phone</span>
              <p className="text-neutral-700">{order.address.phone}</p>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white border border-[#E9E7E3] p-5 space-y-3 text-xs">
            <h3 className="font-display font-bold text-sm text-neutral-900 pb-2 border-b border-[#E9E7E3] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#8A4735]" />
              <span>Delivery Address</span>
            </h3>
            <p className="text-neutral-800 leading-relaxed">
              {order.address.street}
              <br />
              {order.address.city}, {order.address.state}
            </p>
            {order.address.notes && (
              <div className="p-2.5 bg-[#FAF8F5] border border-[#E9E7E3] text-[11px] text-neutral-600">
                <strong>Delivery Note:</strong> {order.address.notes}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
