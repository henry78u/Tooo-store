import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Trash2, ShoppingBag } from 'lucide-react';
import { DEMO_PRODUCTS } from '../data/products';
import { useStore, formatNaira } from '../store/useStore';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, setQuickViewProduct } = useStore();

  const savedProducts = DEMO_PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#E9E7E3] mb-8">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8A4735] block mb-1">
            Curated Archive
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#171717]">
            Saved Pieces ({savedProducts.length})
          </h1>
        </div>
        <Link
          to="/shop"
          className="text-xs font-semibold text-neutral-800 hover:text-[#8A4735] flex items-center gap-1"
        >
          <span>Continue Browsing</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {savedProducts.length === 0 ? (
        <div className="py-20 text-center max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#F6F3ED] flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 text-neutral-400" />
          </div>
          <h2 className="font-display font-semibold text-lg text-neutral-800">
            No pieces saved yet
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Tap the heart on any garment to curate your personal style archive.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-6 bg-[#171717] text-white text-xs font-semibold py-3 px-6 hover:bg-neutral-800 transition-colors"
          >
            Explore Catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {savedProducts.map((product) => (
            <div key={product.id} className="group relative flex flex-col border border-[#E9E7E3] bg-white">
              {/* Image */}
              <Link
                to={`/product/${product.slug}`}
                className="relative block aspect-[3/4] bg-[#F6F3ED] overflow-hidden"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-neutral-700 hover:text-rose-600 transition-colors shadow-xs"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </Link>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8A4735] tracking-wider block">
                    {product.category}
                  </span>
                  <Link
                    to={`/product/${product.slug}`}
                    className="font-medium text-xs sm:text-sm text-neutral-900 hover:text-[#8A4735] transition-colors line-clamp-1 mt-0.5"
                  >
                    {product.name}
                  </Link>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-semibold text-xs sm:text-sm text-neutral-900 tabular-nums">
                      {formatNaira(product.price)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-[11px] text-neutral-400 line-through tabular-nums">
                        {formatNaira(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setQuickViewProduct(product)}
                  className="w-full bg-[#171717] hover:bg-neutral-800 text-white text-xs font-semibold py-2 px-3 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Select & Add to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
