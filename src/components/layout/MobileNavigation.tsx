import React from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight, User, Heart, PackageSearch, Sparkles } from 'lucide-react';
import { CATEGORIES_DATA } from '../../data/products';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-white h-full flex flex-col shadow-2xl z-10 overflow-y-auto">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E9E7E3]">
          <Link
            to="/"
            onClick={onClose}
            className="font-display font-extrabold text-2xl tracking-tighter text-[#171717]"
          >
            TOOO<span className="text-[#8A4735]">.</span>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[#77746F] uppercase tracking-wider block mb-2">
                Main Menu
              </span>
              <Link
                to="/shop"
                onClick={onClose}
                className="flex items-center justify-between py-2.5 text-lg font-medium text-neutral-900 border-b border-neutral-100"
              >
                <span>All Garments</span>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </Link>
              <Link
                to="/shop?sort=newest"
                onClick={onClose}
                className="flex items-center justify-between py-2.5 text-lg font-medium text-neutral-900 border-b border-neutral-100"
              >
                <span className="flex items-center gap-2">
                  New Arrivals
                  <span className="text-[10px] uppercase font-bold text-[#8A4735]">Fresh Drop</span>
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </Link>
              <Link
                to="/collections"
                onClick={onClose}
                className="flex items-center justify-between py-2.5 text-lg font-medium text-neutral-900 border-b border-neutral-100"
              >
                <span>Curated Collections</span>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </Link>
              <Link
                to="/about"
                onClick={onClose}
                className="flex items-center justify-between py-2.5 text-lg font-medium text-neutral-900 border-b border-neutral-100"
              >
                <span>The TOOO Story</span>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </Link>
            </div>

            {/* Categories */}
            <div>
              <span className="text-[11px] font-semibold text-[#77746F] uppercase tracking-wider block mb-3">
                Shop By Category
              </span>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES_DATA.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/shop?category=${encodeURIComponent(cat.name)}`}
                    onClick={onClose}
                    className="p-3 bg-[#F6F3ED] rounded hover:bg-neutral-200 transition-colors text-xs font-medium text-neutral-800"
                  >
                    <div className="font-semibold text-neutral-900">{cat.name}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">{cat.itemCount}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Customer Links */}
            <div className="pt-2 border-t border-neutral-100 space-y-2">
              <Link
                to="/account"
                onClick={onClose}
                className="flex items-center gap-3 py-2 text-sm text-neutral-700 hover:text-neutral-900"
              >
                <User className="w-4 h-4" />
                <span>My Account & Orders</span>
              </Link>
              <Link
                to="/wishlist"
                onClick={onClose}
                className="flex items-center gap-3 py-2 text-sm text-neutral-700 hover:text-neutral-900"
              >
                <Heart className="w-4 h-4" />
                <span>Saved Pieces (Wishlist)</span>
              </Link>
              <Link
                to="/track-order"
                onClick={onClose}
                className="flex items-center gap-3 py-2 text-sm text-neutral-700 hover:text-neutral-900"
              >
                <PackageSearch className="w-4 h-4" />
                <span>Order Tracking</span>
              </Link>
            </div>
          </div>

          {/* Footer note in Drawer */}
          <div className="mt-8 pt-4 border-t border-[#E9E7E3] text-xs text-neutral-500">
            <div className="flex items-center justify-between">
              <span>Currency</span>
              <span className="font-semibold text-neutral-800">NGN (₦) · Lagos Atelier</span>
            </div>
            <p className="mt-2 text-[11px] text-neutral-400">
              Made to Be Worn. Made to Be Seen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
