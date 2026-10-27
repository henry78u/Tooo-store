import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const {
    cart,
    wishlist,
    openCart,
    openSearch,
  } = useStore();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 bg-white/95 backdrop-blur-md ${
        isScrolled
          ? 'py-3.5 border-b border-[#E9E7E3] shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
          : 'py-5 border-b border-[#E9E7E3]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Mobile hamburger trigger (left on mobile) */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={onOpenMobileMenu}
              className="p-1.5 -ml-1.5 text-neutral-900 hover:text-neutral-600 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={openSearch}
              className="p-1.5 text-neutral-900 hover:text-neutral-600 transition-colors"
              aria-label="Search store"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Left: Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium tracking-wide">
            <Link
              to="/shop"
              className={`whitespace-nowrap transition-colors hover:text-neutral-900 ${
                location.pathname === '/shop' ? 'text-neutral-900 font-semibold' : 'text-neutral-600'
              }`}
            >
              Shop
            </Link>
            <Link
              to="/shop?sort=newest"
              className="whitespace-nowrap text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              New Arrivals
            </Link>
            <Link
              to="/collections"
              className={`whitespace-nowrap transition-colors hover:text-neutral-900 ${
                location.pathname.startsWith('/collections') ? 'text-neutral-900 font-semibold' : 'text-neutral-600'
              }`}
            >
              Collections
            </Link>
            <Link
              to="/about"
              className={`whitespace-nowrap transition-colors hover:text-neutral-900 ${
                location.pathname === '/about' ? 'text-neutral-900 font-semibold' : 'text-neutral-600'
              }`}
            >
              The Story
            </Link>
          </nav>

          {/* Centre: TOOO. Brand Wordmark */}
          <div className="flex-1 text-center md:flex-initial">
            <Link
              to="/"
              className="inline-block font-display font-extrabold text-2xl tracking-[-0.05em] text-[#171717] hover:opacity-90 transition-opacity"
            >
              TOOO<span className="text-[#8A4735]">.</span>
            </Link>
          </div>

          {/* Right: Actions (Search, Account, Wishlist, Bag) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Desktop Search Button */}
            <button
              onClick={openSearch}
              className="hidden md:flex items-center gap-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors py-1.5 px-2.5 rounded hover:bg-neutral-100"
              aria-label="Search products"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>

            {/* Account */}
            <Link
              to="/account"
              className="p-1.5 text-neutral-700 hover:text-neutral-900 transition-colors rounded hover:bg-neutral-100"
              aria-label="Customer Account"
              title="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-1.5 text-neutral-700 hover:text-neutral-900 transition-colors rounded hover:bg-neutral-100"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#8A4735] text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Bag Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-[#171717] text-white hover:bg-neutral-800 transition-colors px-3 py-1.5 rounded text-xs font-medium"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              <span className="tabular-nums font-semibold">({totalCartCount})</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
