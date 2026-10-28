import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import { useStore, formatNaira } from '../../store/useStore';

export const QuickAddModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useStore();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColour, setSelectedColour] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedColour(quickViewProduct.availableColours[0]?.name || '');
      setSelectedSize('');
      setQuantity(1);
      setErrorMsg('');
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const currentVariant = selectedSize && selectedColour
    ? quickViewProduct.variants?.find(
        (v) =>
          v.size === selectedSize &&
          v.colour.toLowerCase().trim() === selectedColour.toLowerCase().trim()
      )
    : undefined;

  const currentAvailableStock = currentVariant !== undefined
    ? currentVariant.stock
    : selectedSize
    ? 0
    : quickViewProduct.stock;

  const isSoldOut = Boolean(selectedSize && selectedColour && currentAvailableStock <= 0);

  const handleAdd = () => {
    if (!selectedSize) {
      setErrorMsg('Please select a size before adding to your bag.');
      return;
    }
    if (!selectedColour) {
      setErrorMsg('Please select a colour.');
      return;
    }
    if (currentAvailableStock <= 0) {
      setErrorMsg('This size and colour combination is sold out.');
      return;
    }
    setErrorMsg('');
    addToCart(quickViewProduct, selectedSize, selectedColour, quantity);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setQuickViewProduct(null)}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white shadow-2xl z-10 overflow-hidden border border-[#E9E7E3] animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-1 text-neutral-400 hover:text-neutral-900 bg-white/80 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col sm:flex-row">
          {/* Product Thumbnail */}
          <div className="sm:w-5/12 bg-[#F6F3ED] aspect-[3/4] sm:aspect-auto overflow-hidden">
            <img
              src={quickViewProduct.images[0]}
              alt={quickViewProduct.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details & Controls */}
          <div className="p-6 sm:w-7/12 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-[#8A4735] uppercase tracking-wider">
                {quickViewProduct.category}
              </span>
              <h3 className="font-display font-semibold text-lg text-[#171717] mt-0.5 leading-snug">
                {quickViewProduct.name}
              </h3>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="font-semibold text-base text-[#171717] tabular-nums">
                  {formatNaira(quickViewProduct.price)}
                </span>
                {quickViewProduct.compareAtPrice && (
                  <span className="text-xs text-[#77746F] line-through tabular-nums">
                    {formatNaira(quickViewProduct.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Colour Selector */}
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-700 mb-1.5">
                <span className="font-medium">Colour:</span>
                <span className="text-neutral-900 font-semibold">{selectedColour}</span>
              </div>
              <div className="flex items-center gap-2">
                {quickViewProduct.availableColours.map((c) => {
                  const isSelected = selectedColour === c.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColour(c.name)}
                      className={`relative w-7 h-7 rounded-full border transition-all ${
                        isSelected ? 'ring-2 ring-neutral-900 ring-offset-2' : 'border-neutral-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-white drop-shadow-md mx-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-700 mb-1.5">
                <span className="font-medium">Size:</span>
                <span className="text-neutral-500 text-[11px]">Required</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {quickViewProduct.availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  const sizeVar = quickViewProduct.variants?.find(
                    (v) =>
                      v.size === size &&
                      v.colour.toLowerCase().trim() === selectedColour.toLowerCase().trim()
                  );
                  const isSizeSoldOut = sizeVar !== undefined ? sizeVar.stock <= 0 : false;

                  return (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setErrorMsg('');
                      }}
                      className={`py-2 text-xs font-semibold uppercase transition-colors border ${
                        isSizeSoldOut
                          ? 'bg-neutral-100 text-neutral-400 border-neutral-200 line-through'
                          : isSelected
                          ? 'bg-[#171717] text-white border-[#171717]'
                          : 'bg-white text-neutral-800 border-[#E9E7E3] hover:border-neutral-800'
                      }`}
                      title={isSizeSoldOut ? `${size} sold out` : size}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stock indicator */}
            {selectedSize && selectedColour && (
              <div className="text-xs">
                {isSoldOut ? (
                  <span className="text-rose-700 font-medium">Sold Out</span>
                ) : currentAvailableStock <= 3 ? (
                  <span className="text-amber-800 font-medium">Only {currentAvailableStock} left</span>
                ) : (
                  <span className="text-emerald-700 font-medium">In Stock</span>
                )}
              </div>
            )}

            {/* Validation Message */}
            {errorMsg && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2 border border-rose-200">
                {errorMsg}
              </p>
            )}

            {/* CTA Button */}
            <button
              onClick={handleAdd}
              disabled={isSoldOut}
              className={`w-full font-medium py-3 px-4 text-xs transition-colors flex items-center justify-center gap-2 shadow-sm ${
                isSoldOut
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-[#171717] hover:bg-neutral-800 text-white'
              }`}
            >
              <span>{isSoldOut ? 'Sold Out' : 'Add to Bag'}</span>
              {!isSoldOut && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
