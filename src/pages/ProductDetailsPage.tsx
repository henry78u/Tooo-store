import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  ArrowRight,
  Share2,
  Check,
  X,
} from 'lucide-react';
import { DEMO_PRODUCTS } from '../data/products';
import { ProductCard } from '../components/commerce/ProductCard';
import { useStore, formatNaira } from '../store/useStore';
import { Product } from '../types';

export const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, isInWishlist, toggleWishlist, setQuickViewProduct, addToast } = useStore();

  const product = DEMO_PRODUCTS.find((p) => p.slug === slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColour, setSelectedColour] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [validationError, setValidationError] = useState<string>('');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Accordion states
  const [openAccordion, setOpenAccordion] = useState<string | null>('fabric');

  useEffect(() => {
    if (product) {
      window.scrollTo(0, 0);
      setActiveImageIndex(0);
      setSelectedColour(product.availableColours[0]?.name || '');
      setSelectedSize('');
      setQuantity(1);
      setValidationError('');
    }
  }, [product, slug]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display font-semibold text-2xl text-neutral-800">
          Garment Not Found
        </h2>
        <p className="text-sm text-neutral-500 mt-2">
          The requested silhouette does not exist in our current collection or has been archived.
        </p>
        <Link
          to="/shop"
          className="inline-block mt-6 bg-[#171717] text-white text-xs font-semibold py-3 px-6"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setValidationError('Please select a garment size before adding to your bag.');
      return;
    }
    if (!selectedColour) {
      setValidationError('Please select a colour.');
      return;
    }
    setValidationError('');
    addToCart(product, selectedSize, selectedColour, quantity);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        title: 'Link Copied',
        description: 'Product URL copied to clipboard.',
        type: 'info',
      });
    }
  };

  // Related products from same category or collection
  const relatedProducts = DEMO_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.collection === product.collection)
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-neutral-500 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-neutral-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-neutral-900 transition-colors">
          Catalogue
        </Link>
        <span>/</span>
        <Link
          to={`/shop?category=${encodeURIComponent(product.category)}`}
          className="hover:text-neutral-900 transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-neutral-900 font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Gallery Column */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 shrink-0 overflow-x-auto sm:overflow-visible">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 sm:w-20 aspect-[3/4] bg-[#F6F3ED] overflow-hidden border transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#171717] ring-1 ring-[#171717]'
                      : 'border-[#E9E7E3] hover:border-neutral-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Primary Viewport Image */}
          <div className="flex-1 bg-[#F6F3ED] aspect-[3/4] overflow-hidden relative border border-[#E9E7E3]">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.isNew && (
              <span className="absolute top-4 left-4 text-[10px] uppercase font-bold tracking-widest text-[#171717] bg-white/90 backdrop-blur-xs px-2.5 py-1 border border-neutral-200">
                New Season
              </span>
            )}
          </div>
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* Category & Title */}
          <div>
            <div className="flex items-center justify-between text-xs text-[#77746F]">
              <span className="uppercase tracking-widest font-semibold">{product.category}</span>
              <span className="text-[11px] text-neutral-400">{product.collection}</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#171717] mt-1 tracking-tight">
              {product.name}
            </h1>
            <div className="mt-2.5 flex items-baseline gap-3">
              <span className="font-semibold text-xl text-[#171717] tabular-nums font-display">
                {formatNaira(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-[#77746F] line-through tabular-nums">
                  {formatNaira(product.compareAtPrice)}
                </span>
              )}
              <span className="text-xs text-emerald-700 font-medium">
                · In Stock ({product.stock} available)
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {product.description}
          </p>

          <hr className="border-[#E9E7E3]" />

          {/* Colour Selection */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-semibold text-neutral-800">
                Colour: <span className="font-normal text-neutral-600">{selectedColour}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              {product.availableColours.map((c) => {
                const isSelected = selectedColour === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColour(c.name)}
                    className={`relative w-8 h-8 rounded-full border transition-all ${
                      isSelected ? 'ring-2 ring-neutral-900 ring-offset-2' : 'border-neutral-300'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {isSelected && (
                      <Check className="w-4 h-4 text-white drop-shadow mx-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-semibold text-neutral-800">
                Size: <span className="font-normal text-neutral-600">{selectedSize || 'Select a size'}</span>
              </span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-[#8A4735] hover:underline flex items-center gap-1 font-medium text-xs"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {product.availableSizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setValidationError('');
                    }}
                    className={`py-2.5 text-xs font-semibold uppercase transition-all border ${
                      isSelected
                        ? 'bg-[#171717] text-white border-[#171717]'
                        : 'bg-white text-neutral-800 border-[#E9E7E3] hover:border-neutral-900'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {validationError && (
              <p className="mt-2 text-xs text-rose-600 bg-rose-50 p-2 border border-rose-200">
                {validationError}
              </p>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#E9E7E3] bg-white h-12 px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-semibold tabular-nums text-neutral-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#171717] hover:bg-neutral-800 text-white font-semibold text-xs uppercase tracking-wider h-12 px-6 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Add to Bag</span>
                <span className="tabular-nums font-normal">
                  ({formatNaira(product.price * quantity)})
                </span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-12 h-12 border flex items-center justify-center transition-colors ${
                  isWishlisted
                    ? 'border-[#8A4735] bg-[#8A4735]/10 text-[#8A4735]'
                    : 'border-[#E9E7E3] hover:border-neutral-800 text-neutral-700'
                }`}
                aria-label="Wishlist toggle"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#8A4735]' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleShare}
              className="w-full text-center text-xs text-neutral-500 hover:text-neutral-800 py-1 transition-colors flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share this silhouette</span>
            </button>
          </div>

          {/* Accordion Panels for Details, Fabric, Shipping */}
          <div className="border-t border-[#E9E7E3] divide-y divide-[#E9E7E3] pt-4 text-xs">
            {/* Fabric & Care */}
            <div className="py-3">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'fabric' ? null : 'fabric')}
                className="w-full flex items-center justify-between font-semibold text-neutral-900 py-1"
              >
                <span>Fabric Composition & Garment Care</span>
                {openAccordion === 'fabric' ? (
                  <ChevronUp className="w-4 h-4 text-neutral-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-500" />
                )}
              </button>
              {openAccordion === 'fabric' && (
                <ul className="mt-2.5 space-y-1.5 text-neutral-600 pl-4 list-disc marker:text-[#8A4735]">
                  {product.fabricCare.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Design & Fit Details */}
            <div className="py-3">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'details' ? null : 'details')}
                className="w-full flex items-center justify-between font-semibold text-neutral-900 py-1"
              >
                <span>Design Architecture & Features</span>
                {openAccordion === 'details' ? (
                  <ChevronUp className="w-4 h-4 text-neutral-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-500" />
                )}
              </button>
              {openAccordion === 'details' && (
                <ul className="mt-2.5 space-y-1.5 text-neutral-600 pl-4 list-disc marker:text-[#8A4735]">
                  {product.details.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Delivery & Returns */}
            <div className="py-3">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                className="w-full flex items-center justify-between font-semibold text-neutral-900 py-1"
              >
                <span>Delivery in Nigeria & Return Policy</span>
                {openAccordion === 'shipping' ? (
                  <ChevronUp className="w-4 h-4 text-neutral-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-500" />
                )}
              </button>
              {openAccordion === 'shipping' && (
                <div className="mt-2.5 space-y-2 text-neutral-600 leading-relaxed">
                  <p>
                    <strong>Lagos Atelier Dispatch:</strong> 1-2 business days. Complimentary delivery for orders over ₦100,000.
                  </p>
                  <p>
                    <strong>Nationwide Interstate:</strong> 2-4 business days via dedicated courier partners (Abuja, Port Harcourt, Ibadan, Kano, etc.).
                  </p>
                  <p>
                    <strong>Returns:</strong> 14-day hassle-free exchange or store credit on unworn garments with tags attached.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsSizeGuideOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white shadow-2xl z-10 p-6 border border-[#E9E7E3]">
            <div className="flex justify-between items-center pb-4 border-b border-[#E9E7E3]">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-[#8A4735]" />
                <h3 className="font-display font-semibold text-base text-neutral-900">
                  Size & Measurement Guide (cm)
                </h3>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 text-xs">
              <p className="text-neutral-500 mb-4">
                TOOO garments are tailored with contemporary oversized ease. If you prefer a fitted silhouette, consider sizing down.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-400 font-semibold uppercase text-[10px]">
                      <th className="py-2">Size</th>
                      <th className="py-2">Chest</th>
                      <th className="py-2">Waist</th>
                      <th className="py-2">Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 tabular-nums">
                    <tr>
                      <td className="py-2 font-semibold">XS</td>
                      <td className="py-2">94 cm</td>
                      <td className="py-2">76 cm</td>
                      <td className="py-2">68 cm</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold">S</td>
                      <td className="py-2">102 cm</td>
                      <td className="py-2">82 cm</td>
                      <td className="py-2">70 cm</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold">M</td>
                      <td className="py-2">110 cm</td>
                      <td className="py-2">88 cm</td>
                      <td className="py-2">72 cm</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold">L</td>
                      <td className="py-2">118 cm</td>
                      <td className="py-2">96 cm</td>
                      <td className="py-2">74 cm</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold">XL</td>
                      <td className="py-2">126 cm</td>
                      <td className="py-2">104 cm</td>
                      <td className="py-2">76 cm</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="w-full mt-4 bg-[#171717] text-white py-2.5 text-xs font-semibold"
            >
              Close Size Guide
            </button>
          </div>
        </div>
      )}

      {/* Related Products Recommendation Row */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-[#E9E7E3]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-neutral-900 tracking-tight">
              Complete the Look
            </h2>
            <Link
              to="/shop"
              className="text-xs font-semibold text-neutral-700 hover:text-[#8A4735] flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickAdd={() => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
