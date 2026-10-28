import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useStore, formatNaira } from '../../store/useStore';
import { useCommerceProducts } from '../../services/commerceService';

export const SearchOverlay: React.FC = () => {
  const { isSearchOpen, closeSearch } = useStore();
  const allProducts = useCommerceProducts();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeSearch();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isSearchOpen, closeSearch]);

  if (!isSearchOpen) return null;

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesQuery =
      query.trim() === '' ||
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.collection.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  }).slice(0, 8);

  const categories = ['All', 'Outerwear', 'Sets', 'Tops', 'Bottoms', 'Accessories'];

  const handleSelectProduct = (slug: string) => {
    closeSearch();
    navigate(`/product/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeSearch}
        aria-hidden="true"
      />

      {/* Search Modal Container */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl z-10 overflow-hidden border border-[#E9E7E3] animate-in fade-in zoom-in-95 duration-150">
        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 border-b border-[#E9E7E3] flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search silhouettes, wool overcoats, sets, denim..."
            className="flex-1 bg-transparent text-base sm:text-lg text-neutral-900 placeholder-neutral-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-neutral-400 hover:text-neutral-700 p-1 text-xs"
              aria-label="Clear search input"
            >
              Clear
            </button>
          )}
          <button
            onClick={closeSearch}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Category Filter Bar */}
        <div className="px-5 py-2.5 bg-[#F6F3ED] border-b border-[#E9E7E3] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] uppercase tracking-wider text-[#77746F] font-semibold shrink-0">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-medium transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#171717] text-white'
                  : 'bg-white text-neutral-600 hover:text-neutral-900 border border-[#E9E7E3]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5 space-y-2">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-neutral-500">
              <p className="text-sm">No garments found matching "{query}".</p>
              <p className="text-xs text-neutral-400 mt-1">
                Try searching for "overcoat", "hoodie", "trouser", or "tote".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectProduct(p.slug)}
                  className="flex items-center gap-3 p-2 hover:bg-[#F6F3ED] cursor-pointer transition-colors border border-transparent hover:border-[#E9E7E3] group"
                >
                  <div className="w-14 aspect-[3/4] bg-neutral-200 shrink-0 overflow-hidden">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-[#8A4735] font-semibold block">
                      {p.category}
                    </span>
                    <h4 className="text-xs font-medium text-neutral-900 truncate group-hover:text-[#8A4735] transition-colors">
                      {p.name}
                    </h4>
                    <span className="text-xs font-semibold text-neutral-800 tabular-nums">
                      {formatNaira(p.price)}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Footer info */}
        <div className="p-3 bg-neutral-50 border-t border-[#E9E7E3] flex items-center justify-between text-[11px] text-neutral-500">
          <span>{filteredProducts.length} results displayed</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 text-[10px] rounded">ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
};
