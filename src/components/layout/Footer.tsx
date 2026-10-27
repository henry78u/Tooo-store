import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Instagram, Globe } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const addToast = useStore((s) => s.addToast);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setStatus('success');
    setErrorMessage('');
    addToast({
      title: 'Welcome to the TOOO Circle',
      description: 'You are now subscribed for seasonal lookbooks and private access.',
      type: 'success',
    });
    setEmail('');
  };

  return (
    <footer className="bg-[#171717] text-[#D8D0C5] border-t border-neutral-800">
      {/* Upper Newsletter & Brand Vision Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 border-b border-neutral-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#8A4735] font-semibold">
              Editorial Dispatch
            </span>
            <h3 className="font-display text-2xl sm:text-3xl text-white font-medium tracking-tight">
              Stay inside the TOOO orbit.
            </h3>
            <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
              Receive limited capsule invitations, lookbook debuts, and private atelier pre-orders before public release.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  className="bg-white text-neutral-900 hover:bg-neutral-200 font-medium px-6 py-3 text-sm transition-colors flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {status === 'error' && (
                <p className="text-xs text-rose-400">{errorMessage}</p>
              )}
              {status === 'success' && (
                <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Subscription confirmed. Thank you for joining our circle.</span>
                </p>
              )}
              <p className="text-[11px] text-neutral-500">
                By subscribing you agree to receive digital dispatches. Client confidentiality honored.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <Link
              to="/"
              className="inline-block font-display font-extrabold text-2xl tracking-tight text-white"
            >
              TOOO<span className="text-[#8A4735]">.</span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              TOOO STORE is a contemporary fashion brand crafting modern garments engineered to be worn and seen. Contemporary streetwear, elevated tailoring, and refined silhouettes.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-colors"
                aria-label="TikTok"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  All Garments
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Outerwear" className="hover:text-white transition-colors">
                  Outerwear & Trench
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Sets" className="hover:text-white transition-colors">
                  Coordinate Sets
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Tops" className="hover:text-white transition-colors">
                  Tops & Heavyweight Knits
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Bottoms" className="hover:text-white transition-colors">
                  Pleated Trousers & Denim
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Accessories" className="hover:text-white transition-colors">
                  Atelier Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Service */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Client Care
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link to="/track-order" className="hover:text-white transition-colors">
                  Track Delivery
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-white transition-colors">
                  Customer Profile
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  Saved Items
                </Link>
              </li>
              <li>
                <a href="#shipping-guide" onClick={(e) => { e.preventDefault(); alert('Complimentary Lagos delivery over ₦100,000. Nationwide Nigeria courier 2-4 business days.'); }} className="hover:text-white transition-colors">
                  Shipping & Delivery
                </a>
              </li>
              <li>
                <a href="#returns-policy" onClick={(e) => { e.preventDefault(); alert('Returns accepted within 14 days of delivery in pristine condition with original tags intact.'); }} className="hover:text-white transition-colors">
                  Returns & Exchanges
                </a>
              </li>
            </ul>
          </div>

          {/* Brand / Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Brand
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Brand Philosophy
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-white transition-colors">
                  Curated Lookbook
                </Link>
              </li>
              <li>
                <span className="text-neutral-500">Lagos Atelier & Headquarters</span>
              </li>
              <li>
                <span className="text-neutral-500">support@tooostore.example</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-neutral-800 text-xs text-neutral-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} TOOO STORE. All rights reserved. Your Style. Your Statement.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <span>Prices in Nigerian Naira (NGN ₦)</span>
            <span>·</span>
            <span>Prototype Demonstration Storefront</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
