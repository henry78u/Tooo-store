import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, RotateCcw, Check } from 'lucide-react';
import { DEMO_PRODUCTS } from '../data/products';
import { ProductCard } from '../components/commerce/ProductCard';
import { FilterState, ProductCategory } from '../types';
import { useStore, formatNaira } from '../store/useStore';

const CATEGORIES: ProductCategory[] = ['Outerwear', 'Sets', 'Tops', 'Bottoms', 'Accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'];
const COLOURS = [
  { name: 'Black', hex: '#1C1C1E' },
  { name: 'Oatmeal / Beige', hex: '#D8D0C5' },
  { name: 'Terracotta', hex: '#8A4735' },
  { name: 'Camel / Brown', hex: '#9C6F44' },
  { name: 'Grey', hex: '#4A4A4A' },
  { name: 'White / Cream', hex: '#FAF8F5' },
];

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setQuickViewProduct } = useStore();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Initialize filters from query params
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('category') || 'All',
    size: searchParams.get('size') || 'All',
    colour: searchParams.get('colour') || 'All',
    minPrice: 0,
    maxPrice: 150000,
    inStockOnly: searchParams.get('inStock') === 'true',
    sortBy: (searchParams.get('sort') as FilterState['sortBy']) || 'featured',
  });

  // Sync when searchParams change (e.g. from nav link)
  useEffect(() => {
    const cat = searchParams.get('category');
    const sort = searchParams.get('sort');
    if (cat) {
      setFilters((prev) => ({ ...prev, category: cat }));
    }
    if (sort) {
      setFilters((prev) => ({ ...prev, sortBy: sort as FilterState['sortBy'] }));
    }
  }, [searchParams]);

  const resetFilters = () => {
    setFilters({
      category: 'All',
      size: 'All',
      colour: 'All',
      minPrice: 0,
      maxPrice: 150000,
      inStockOnly: false,
      sortBy: 'featured',
    });
    setSearchParams({});
  };

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return DEMO_PRODUCTS.filter((product) => {
      // Category filter
      if (filters.category !== 'All' && product.category !== filters.category) {
        return false;
      }
      // Size filter
      if (filters.size !== 'All' && !product.availableSizes.includes(filters.size)) {
        return false;
      }
      // Colour filter
      if (filters.colour !== 'All') {
        const matchesColour = product.availableColours.some((c) =>
          c.name.toLowerCase().includes(filters.colour.toLowerCase().split('/')[0].trim())
        );
        if (!matchesColour) return false;
      }
      // Price range
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }
      // In stock
      if (filters.inStockOnly && product.stock <= 0) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (filters.sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (filters.sortBy === 'price-desc') {
        return b.price - a.price;
      }
      // Default: featured
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [filters]);

  const activeFilterCount =
    (filters.category !== 'All' ? 1 : 0) +
    (filters.size !== 'All' ? 1 : 0) +
    (filters.colour !== 'All' ? 1 : 0) +
    (filters.maxPrice < 150000 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Header Banner */}
      <div className="border-b border-[#E9E7E3] pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8A4735] block mb-1">
              Atelier Catalogue
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#171717] tracking-tight">
              {filters.category === 'All' ? 'All Garments & Essentials' : filters.category}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
              Contemporary silhouettes engineered with premium fabrics, architectural cuts, and minimal detailing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500 tabular-nums">
              Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'piece' : 'pieces'}
            </span>

            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-[#E9E7E3] bg-white px-3.5 py-2 text-xs font-semibold text-neutral-800"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#171717] text-white text-[10px] flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-7 sticky top-24 pr-4 border-r border-[#E9E7E3]/70">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E7E3]">
            <span className="font-display font-semibold text-sm text-neutral-900 tracking-wide">
              Filter By
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#8A4735] hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-2.5">
              Category
            </label>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setFilters({ ...filters, category: 'All' })}
                className={`w-full text-left py-1 px-2 rounded transition-colors ${
                  filters.category === 'All'
                    ? 'bg-[#171717] text-white font-medium'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All Pieces
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilters({ ...filters, category: cat })}
                  className={`w-full text-left py-1 px-2 rounded transition-colors ${
                    filters.category === cat
                      ? 'bg-[#171717] text-white font-medium'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-2.5">
              Size
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setFilters({ ...filters, size: 'All' })}
                className={`py-1.5 text-xs font-medium border text-center transition-colors ${
                  filters.size === 'All'
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-white text-neutral-700 border-[#E9E7E3] hover:border-neutral-700'
                }`}
              >
                All
              </button>
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setFilters({ ...filters, size })}
                  className={`py-1.5 text-xs font-medium border text-center transition-colors ${
                    filters.size === size
                      ? 'bg-[#171717] text-white border-[#171717]'
                      : 'bg-white text-neutral-700 border-[#E9E7E3] hover:border-neutral-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colours */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-2.5">
              Colour
            </label>
            <div className="space-y-1.5">
              <button
                onClick={() => setFilters({ ...filters, colour: 'All' })}
                className={`w-full text-left py-1 px-2 text-xs rounded transition-colors ${
                  filters.colour === 'All'
                    ? 'bg-[#171717] text-white font-medium'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All Tones
              </button>
              {COLOURS.map((col) => (
                <button
                  key={col.name}
                  onClick={() => setFilters({ ...filters, colour: col.name })}
                  className={`w-full flex items-center justify-between py-1 px-2 text-xs rounded transition-colors ${
                    filters.colour === col.name
                      ? 'bg-neutral-100 font-semibold text-neutral-900'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full border border-neutral-300"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </div>
                  {filters.colour === col.name && (
                    <Check className="w-3.5 h-3.5 text-neutral-900" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2">
              <span>Max Price</span>
              <span className="text-neutral-900 tabular-nums font-semibold">
                {formatNaira(filters.maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="20000"
              max="150000"
              step="5000"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full accent-[#171717] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
              <span>₦20,000</span>
              <span>₦150,000+</span>
            </div>
          </div>

          {/* Availability */}
          <div className="pt-2 border-t border-[#E9E7E3]">
            <label className="flex items-center gap-2.5 text-xs font-medium text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
                className="w-4 h-4 accent-[#171717] rounded"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-9">
          {/* Top Sort Bar */}
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E9E7E3]/60 text-xs text-neutral-600">
            <div>
              {activeFilterCount > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-neutral-500">Active:</span>
                  {filters.category !== 'All' && (
                    <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded text-[11px]">
                      {filters.category}
                    </span>
                  )}
                  {filters.size !== 'All' && (
                    <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded text-[11px]">
                      Size: {filters.size}
                    </span>
                  )}
                  {filters.colour !== 'All' && (
                    <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded text-[11px]">
                      {filters.colour}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-neutral-500 font-medium">Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })
                }
                className="bg-transparent border border-[#E9E7E3] px-2.5 py-1 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
              >
                <option value="featured">Featured Pieces</option>
                <option value="newest">Newest Releases</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-[#F6F3ED]/40 border border-[#E9E7E3] p-8">
              <h3 className="font-display font-semibold text-lg text-neutral-800">
                No garments matched your criteria
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Try widening your price range, or reset your filters to browse the full TOOO collection.
              </p>
              <button
                onClick={resetFilters}
                className="mt-5 bg-[#171717] text-white text-xs font-semibold py-2.5 px-6 hover:bg-neutral-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickAdd={() => setQuickViewProduct(product)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white h-full flex flex-col shadow-2xl z-10 overflow-y-auto p-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#E9E7E3]">
              <h3 className="font-display font-semibold text-base text-neutral-900">
                Filter & Refine
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-6 flex-1">
              {/* Category */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    onClick={() => setFilters({ ...filters, category: 'All' })}
                    className={`py-2 px-2 text-center rounded border ${
                      filters.category === 'All'
                        ? 'bg-[#171717] text-white border-[#171717]'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    All
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilters({ ...filters, category: cat })}
                      className={`py-2 px-2 text-center rounded border ${
                        filters.category === cat
                          ? 'bg-[#171717] text-white border-[#171717]'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-2">
                  Size
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        setFilters({ ...filters, size: filters.size === size ? 'All' : size })
                      }
                      className={`py-2 text-center border font-semibold ${
                        filters.size === size
                          ? 'bg-[#171717] text-white border-[#171717]'
                          : 'bg-white text-neutral-800 border-neutral-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-2">
                  Max Price: {formatNaira(filters.maxPrice)}
                </label>
                <input
                  type="range"
                  min="20000"
                  max="150000"
                  step="5000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                  className="w-full accent-[#171717]"
                />
              </div>
            </div>

            {/* Mobile Filter Action Buttons */}
            <div className="pt-4 border-t border-[#E9E7E3] space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-[#171717] text-white text-xs font-semibold py-3"
              >
                Apply Filters ({filteredProducts.length} pieces)
              </button>
              <button
                onClick={resetFilters}
                className="w-full border border-neutral-300 text-neutral-700 text-xs font-semibold py-2.5"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
