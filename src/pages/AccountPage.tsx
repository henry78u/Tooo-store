import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Package, Heart, LogOut, Plus, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { useStore, formatNaira } from '../store/useStore';
import { NIGERIAN_STATES } from '../data/products';

export const AccountPage: React.FC = () => {
  const { user, loginUser, logoutUser, addAddress, orders, wishlist } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [authMode, setAuthMode] = useState<'signin' | 'register' | 'forgot'>('signin');

  // Signin form state
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');

  // Add address modal state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('Lagos');
  const [newLabel, setNewLabel] = useState('Residence');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authEmail.includes('@')) return;
    loginUser(authEmail, authName || 'Valued Customer');
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity) return;
    addAddress({
      label: newLabel,
      street: newStreet,
      city: newCity,
      state: newState,
      isDefault: false,
    });
    setIsAddingAddress(false);
    setNewStreet('');
    setNewCity('');
  };

  if (!user.isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="bg-white border border-[#E9E7E3] p-8 shadow-sm">
          <div className="text-center mb-6">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8A4735]">
              Client Access
            </span>
            <h1 className="font-display font-extrabold text-2xl text-neutral-900 mt-1">
              {authMode === 'signin' && 'Sign in to TOOO'}
              {authMode === 'register' && 'Create Your Atelier Account'}
              {authMode === 'forgot' && 'Reset Password'}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Demonstration authentication portal. Enter any email to continue.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. Adebayo Johnson"
                  className="w-full border border-[#E9E7E3] p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-neutral-800 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full border border-[#E9E7E3] p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>

            {authMode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-neutral-800">Password</label>
                  {authMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-[11px] text-[#8A4735] hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  defaultValue="demo-password"
                  className="w-full border border-[#E9E7E3] p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#171717] hover:bg-neutral-800 text-white font-semibold text-xs py-3 transition-colors"
            >
              {authMode === 'signin' && 'Sign In'}
              {authMode === 'register' && 'Register Account'}
              {authMode === 'forgot' && 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#E9E7E3] text-center text-xs text-neutral-600">
            {authMode === 'signin' ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setAuthMode('register')}
                  className="font-semibold text-neutral-900 hover:underline"
                >
                  Create one
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setAuthMode('signin')}
                  className="font-semibold text-neutral-900 hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#E9E7E3] mb-8 gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8A4735] block mb-1">
            Client Portal
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-900">
            Welcome, {user.name}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            {user.email} · Registered Client
          </p>
        </div>

        <button
          onClick={logoutUser}
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 border border-[#E9E7E3] px-3.5 py-2 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Tabs */}
        <aside className="lg:col-span-3 space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between p-3 text-xs font-semibold rounded text-left transition-colors ${
              activeTab === 'orders'
                ? 'bg-[#171717] text-white'
                : 'bg-white text-neutral-700 hover:bg-[#F6F3ED]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Order History</span>
            </div>
            <span className="tabular-nums font-normal opacity-80">({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center justify-between p-3 text-xs font-semibold rounded text-left transition-colors ${
              activeTab === 'addresses'
                ? 'bg-[#171717] text-white'
                : 'bg-white text-neutral-700 hover:bg-[#F6F3ED]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </div>
            <span className="tabular-nums font-normal opacity-80">({user.addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between p-3 text-xs font-semibold rounded text-left transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#171717] text-white'
                : 'bg-white text-neutral-700 hover:bg-[#F6F3ED]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </div>
          </button>

          <Link
            to="/wishlist"
            className="w-full flex items-center justify-between p-3 text-xs font-semibold rounded text-left bg-white text-neutral-700 hover:bg-[#F6F3ED] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4" />
              <span>Saved Pieces (Wishlist)</span>
            </div>
            <span className="tabular-nums font-normal opacity-80">({wishlist.length})</span>
          </Link>
        </aside>

        {/* Content Panel */}
        <div className="lg:col-span-9 bg-white border border-[#E9E7E3] p-6 sm:p-8">
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E9E7E3]">
                <h2 className="font-display font-semibold text-lg text-neutral-900">
                  Recent Orders
                </h2>
                <span className="text-xs text-neutral-500">
                  Showing {orders.length} simulated {orders.length === 1 ? 'order' : 'orders'}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center text-neutral-500">
                  <p className="text-sm">You haven't placed any orders yet.</p>
                  <Link
                    to="/shop"
                    className="inline-block mt-4 bg-[#171717] text-white text-xs font-semibold py-2 px-5"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.orderReference}
                      className="border border-[#E9E7E3] bg-[#FAF8F5] p-5 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E9E7E3] pb-3">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-sm text-neutral-900">
                              {order.orderReference}
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A4735] bg-white px-2 py-0.5 border border-neutral-200">
                              {order.deliveryStatus}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Placed on {order.date} · {order.items.length} items
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-bold text-sm text-neutral-900 tabular-nums">
                            {formatNaira(order.total)}
                          </span>
                          <Link
                            to={`/track-order?ref=${order.orderReference}`}
                            className="bg-[#171717] text-white hover:bg-neutral-800 text-xs px-3 py-1.5 font-medium transition-colors"
                          >
                            Track Order
                          </Link>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-xs">
                            <img
                              src={item.image}
                              alt={item.productName}
                              referrerPolicy="no-referrer"
                              className="w-10 aspect-[3/4] object-cover bg-neutral-200"
                            />
                            <div className="flex-1 truncate">
                              <span className="font-medium text-neutral-900 block truncate">
                                {item.productName}
                              </span>
                              <span className="text-neutral-500 text-[11px]">
                                {item.size} · {item.colour} · Qty {item.quantity}
                              </span>
                            </div>
                            <span className="tabular-nums font-semibold text-neutral-800">
                              {formatNaira(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E9E7E3]">
                <h2 className="font-display font-semibold text-lg text-neutral-900">
                  Delivery Addresses
                </h2>
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="bg-[#171717] text-white hover:bg-neutral-800 text-xs font-semibold px-3 py-1.5 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {isAddingAddress && (
                <form
                  onSubmit={handleSaveAddress}
                  className="p-5 border border-[#171717] bg-[#FAF8F5] space-y-4 mb-6"
                >
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Add New Address
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-semibold block mb-1">Label</label>
                      <input
                        type="text"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        placeholder="e.g. Home, Office, Atelier"
                        className="w-full p-2 border border-neutral-300 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">State</label>
                      <select
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        className="w-full p-2 border border-neutral-300 bg-white"
                      >
                        {NIGERIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="text-xs">
                    <label className="font-semibold block mb-1">Street Address</label>
                    <input
                      type="text"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      placeholder="Street name & house number"
                      className="w-full p-2 border border-neutral-300 bg-white"
                      required
                    />
                  </div>
                  <div className="text-xs">
                    <label className="font-semibold block mb-1">City</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="e.g. Ikeja, Lekki, Victoria Island"
                      className="w-full p-2 border border-neutral-300 bg-white"
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="bg-[#171717] text-white text-xs px-4 py-2 font-medium"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="border border-neutral-300 text-neutral-700 text-xs px-4 py-2 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 border border-[#E9E7E3] bg-[#FAF8F5] space-y-2 text-xs relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 font-semibold">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-700">{addr.street}</p>
                    <p className="text-neutral-600">
                      {addr.city}, {addr.state}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-[#E9E7E3]">
                <h2 className="font-display font-semibold text-lg text-neutral-900">
                  Profile Information
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Manage your personal details and contact channels.
                </p>
              </div>

              <div className="space-y-4 max-w-md text-xs">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Name</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full p-2.5 border border-[#E9E7E3] bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full p-2.5 border border-[#E9E7E3] bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Phone</label>
                  <input
                    type="tel"
                    defaultValue={user.phone}
                    className="w-full p-2.5 border border-[#E9E7E3] bg-[#FAF8F5]"
                  />
                </div>
                <button
                  onClick={() => alert('Profile details updated (Simulated Prototype).')}
                  className="bg-[#171717] text-white font-semibold py-2.5 px-6 text-xs hover:bg-neutral-800 transition-colors"
                >
                  Update Information
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
