import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus } from 'lucide-react';
import { Product } from '../../types';
import { formatNaira, useStore } from '../../store/useStore';

interface ProductCardProps {
  product: Product;
  onQuickAdd?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickAdd }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const { isInWishlist, toggleWishlist, setQuickViewProduct } = useStore();
  const isWishlisted = isInWishlist(product.id);

  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickAdd) {
      onQuickAdd(product);
    } else {
      setQuickViewProduct(product);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      className="group relative flex flex-col transition-transform duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block w-full aspect-[3/4] bg-[#F6F3ED] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
      >
        {!imageError ? (
          <>
            <img
              src={isHovered ? secondaryImage : primaryImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#F6F3ED] text-[#77746F]">
            <span className="font-display font-semibold text-sm text-[#171717]">{product.name}</span>
            <span className="text-xs mt-1 text-[#8A4735] uppercase tracking-wider">{product.category}</span>
          </div>
        )}

        {/* Quiet Editorial Tag (Zero-Pill Discipline: clean minimal typography, no candy pills) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start pointer-events-none">
          {product.isNew && (
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#171717] bg-white/90 backdrop-blur-xs px-2 py-0.5 border border-neutral-200">
              New
            </span>
          )}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8A4735] bg-white/90 backdrop-blur-xs px-2 py-0.5 border border-neutral-200">
              Seasonal Mark
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-800 flex items-center justify-center shadow-xs transition-colors backdrop-blur-xs focus:outline-none"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-[#8A4735] text-[#8A4735]' : 'text-neutral-700'
            }`}
          />
        </button>

        {/* Quick Add Overlay Button on Hover */}
        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
          <button
            onClick={handleQuickAddClick}
            className="w-full bg-[#171717]/95 hover:bg-[#171717] text-white text-xs font-semibold py-2.5 px-4 backdrop-blur-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Select</span>
          </button>
        </div>
      </Link>

      {/* Product Details Section */}
      <div className="pt-3 pb-1 flex flex-col flex-1">
        {/* Subtle Category & Colour dots */}
        <div className="flex items-center justify-between text-[11px] text-[#77746F] mb-1">
          <span className="uppercase tracking-wider font-medium">{product.category}</span>
          <div className="flex items-center gap-1" title={`${product.availableColours.length} colours available`}>
            {product.availableColours.slice(0, 3).map((c) => (
              <span
                key={c.name}
                className="w-2.5 h-2.5 rounded-full border border-neutral-300"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.availableColours.length > 3 && (
              <span className="text-[10px] text-neutral-400">+{product.availableColours.length - 3}</span>
            )}
          </div>
        </div>

        {/* Product Name */}
        <Link
          to={`/product/${product.slug}`}
          className="font-medium text-sm text-[#171717] hover:text-[#8A4735] transition-colors line-clamp-1"
        >
          {product.name}
        </Link>

        {/* Price & Compare Price (Tabular Numerals) */}
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-semibold text-sm text-[#171717] tabular-nums">
            {formatNaira(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-[#77746F] line-through tabular-nums">
              {formatNaira(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Mobile Quick Add Trigger */}
        <div className="mt-2.5 sm:hidden">
          <button
            onClick={handleQuickAddClick}
            className="w-full border border-[#E9E7E3] text-[#171717] text-xs font-medium py-1.5 px-3 rounded hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Select Size</span>
          </button>
        </div>
      </div>
    </div>
  );
};
