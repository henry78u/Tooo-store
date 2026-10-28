import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Image as ImageIcon,
  DollarSign,
  Layers,
  Sparkles,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { useAdminStore } from '../../../store/useAdminStore';
import { formatNaira } from '../../../store/useStore';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { Product, ProductCategory, ProductVariant } from '../../../types';
import { OUTERWEAR_CAT_IMAGE, HERO_IMAGE, STORY_IMAGE, SETS_CAT_IMAGE } from '../../../data/products';

export const AddProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, orders } = useAdminStore();

  const isEditing = Boolean(id);
  const existingProduct = isEditing ? products.find((p) => p.id === id) : null;

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Outerwear');
  const [collection, setCollection] = useState('Architectural Tailoring');
  const [price, setPrice] = useState<number>(45000);
  const [compareAtPrice, setCompareAtPrice] = useState<number>(55000);
  const [costPrice, setCostPrice] = useState<number>(18000);

  // Images
  const [images, setImages] = useState<string[]>([OUTERWEAR_CAT_IMAGE, HERO_IMAGE]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Variants
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [colours, setColours] = useState<{ name: string; hex: string }[]>([
    { name: 'Pitch Black', hex: '#171717' },
    { name: 'Oatmeal Beige', hex: '#D8D0C5' },
  ]);
  const [newColourName, setNewColourName] = useState('');
  const [newColourHex, setNewColourHex] = useState('#8A4735');

  // Variant Overrides (stock and custom SKU per size & colour)
  const [variantStockOverrides, setVariantStockOverrides] = useState<Record<string, number>>({});
  const [variantSkuOverrides, setVariantSkuOverrides] = useState<Record<string, string>>({});

  // Badges
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);

  // Fabric & Care
  const [fabricCare, setFabricCare] = useState<string[]>([
    '100% Heavyweight Cotton blend',
    'Dry clean or cold gentle hand wash',
    'Steam on low heat',
  ]);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name);
      setSlug(existingProduct.slug);
      setDescription(existingProduct.description);
      setShortDescription(existingProduct.shortDescription || '');
      setCategory(existingProduct.category);
      setCollection(existingProduct.collection);
      setPrice(existingProduct.price);
      setCompareAtPrice(existingProduct.compareAtPrice || 0);
      setImages(existingProduct.images);
      setSelectedSizes(existingProduct.availableSizes);
      setColours(existingProduct.availableColours);
      setIsFeatured(Boolean(existingProduct.isFeatured));
      setIsNew(Boolean(existingProduct.isNew));
      setIsBestSeller(Boolean(existingProduct.isBestSeller));
      setFabricCare(existingProduct.fabricCare);

      // Prepopulate variant stock and SKU maps to preserve inventory
      const initialStocks: Record<string, number> = {};
      const initialSkus: Record<string, string> = {};
      if (existingProduct.variants && existingProduct.variants.length > 0) {
        existingProduct.variants.forEach((v) => {
          const key = `${v.size}__${v.colour.trim().toLowerCase()}`;
          initialStocks[key] = v.stock;
          if (v.sku) initialSkus[key] = v.sku;
        });
      }
      setVariantStockOverrides(initialStocks);
      setVariantSkuOverrides(initialSkus);
    }
  }, [existingProduct]);

  // Auto-generate slug from name if creating
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      );
    }
  };

  const handleAddColour = () => {
    if (!newColourName.trim()) return;
    const exists = colours.some((c) => c.name.toLowerCase() === newColourName.trim().toLowerCase());
    if (exists) return;
    setColours([...colours, { name: newColourName.trim(), hex: newColourHex }]);
    setNewColourName('');
  };

  const handleRemoveColour = (idx: number) => {
    setColours(colours.filter((_, i) => i !== idx));
  };

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      if (selectedSizes.length > 1) {
        setSelectedSizes(selectedSizes.filter((s) => s !== size));
      }
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (idx: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== idx));
    }
  };

  interface ActiveVariantItem {
    key: string;
    variantId: string;
    size: string;
    colour: string;
    colourHex: string;
    stock: number;
    sku: string;
    isExisting: boolean;
  }

  // Compute active variants based on current size and colour selection
  const computedActiveVariants: ActiveVariantItem[] = [];
  for (const c of colours) {
    for (const s of selectedSizes) {
      const key = `${s}__${c.name.trim().toLowerCase()}`;
      const matchedExisting = existingProduct?.variants?.find(
        (v) => v.size === s && v.colour.trim().toLowerCase() === c.name.trim().toLowerCase()
      );

      // Preserve existing variant stock if present; otherwise use override or default to 0 for new variants
      const stock =
        variantStockOverrides[key] !== undefined
          ? variantStockOverrides[key]
          : matchedExisting
          ? matchedExisting.stock
          : 0;

      const fallbackSku = `TOOO-${(slug || 'ITEM').toUpperCase().slice(0, 4)}-${s}-${c.name.slice(0, 3).toUpperCase()}`;
      const sku =
        variantSkuOverrides[key] !== undefined
          ? variantSkuOverrides[key]
          : matchedExisting?.sku || fallbackSku;

      const variantId =
        matchedExisting?.variantId ||
        `${slug || 'prod'}-${c.name.toLowerCase().replace(/\s+/g, '-')}-${s.toLowerCase()}`;

      computedActiveVariants.push({
        key,
        variantId,
        size: s,
        colour: c.name,
        colourHex: c.hex,
        stock,
        sku,
        isExisting: Boolean(matchedExisting),
      });
    }
  }

  // Detect retired variants from existing product
  const retiredVariants = (existingProduct?.variants || []).filter(
    (ev) =>
      !computedActiveVariants.some(
        (av) =>
          av.size === ev.size &&
          av.colour.trim().toLowerCase() === ev.colour.trim().toLowerCase()
      )
  );

  const retiredVariantsWithOrders = retiredVariants.filter((rv) =>
    orders.some((o) =>
      o.items.some(
        (item) =>
          item.productId === existingProduct?.id &&
          item.size === rv.size &&
          item.colour.toLowerCase() === rv.colour.toLowerCase()
      )
    )
  );

  const handleVariantStockChange = (key: string, val: number) => {
    setVariantStockOverrides((prev) => ({ ...prev, [key]: Math.max(0, val) }));
  };

  const handleVariantSkuChange = (key: string, val: string) => {
    setVariantSkuOverrides((prev) => ({ ...prev, [key]: val }));
  };

  const handleBatchSetStock = (amount: number) => {
    const updated = { ...variantStockOverrides };
    computedActiveVariants.forEach((v) => {
      // If new variant or updating all, set stock
      updated[v.key] = Math.max(0, amount);
    });
    setVariantStockOverrides(updated);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Garment name is required.';

    const trimmedSlug = slug.trim().toLowerCase();
    if (!trimmedSlug) {
      errs.slug = 'Product slug is required.';
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmedSlug)) {
      errs.slug = 'Slug may only contain lowercase letters, numbers, and single hyphens.';
    } else {
      const isDuplicate = products.some(
        (p) => p.slug.trim().toLowerCase() === trimmedSlug && p.id !== existingProduct?.id
      );
      if (isDuplicate) {
        errs.slug = `Slug "${trimmedSlug}" is already taken by another product in the catalogue.`;
      }
    }

    if (price <= 0 || isNaN(price)) {
      errs.price = 'Selling price must be greater than ₦0.';
    }
    if (compareAtPrice < 0 || isNaN(compareAtPrice)) {
      errs.compareAtPrice = 'Compare-at price cannot be negative.';
    }
    if (costPrice < 0 || isNaN(costPrice)) {
      errs.costPrice = 'Cost price cannot be negative.';
    }
    if (images.length === 0) {
      errs.images = 'At least one product image is required.';
    }
    if (selectedSizes.length === 0) {
      errs.sizes = 'Select at least one size.';
    }
    if (colours.length === 0) {
      errs.colours = 'Specify at least one colour.';
    }

    // Check variant stock and SKU uniqueness
    const seenSkus = new Set<string>();
    for (const v of computedActiveVariants) {
      if (v.stock < 0 || isNaN(v.stock)) {
        errs.variants = `Stock for variant ${v.size} / ${v.colour} cannot be negative.`;
        break;
      }
      const cleanSku = v.sku.trim().toUpperCase();
      if (cleanSku) {
        if (seenSkus.has(cleanSku)) {
          errs.variants = `Duplicate SKU "${cleanSku}" detected across variants. Each variant must possess a unique SKU.`;
          break;
        }
        seenSkus.add(cleanSku);
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    // Generate variants with preserved stocks and SKUs
    const finalVariants: ProductVariant[] = computedActiveVariants.map((v) => ({
      variantId: v.variantId,
      size: v.size,
      colour: v.colour,
      stock: Math.max(0, Math.floor(v.stock)),
      sku: v.sku.trim().toUpperCase(),
    }));

    const totalCalculatedStock = finalVariants.reduce((sum, v) => sum + v.stock, 0);

    const payload: Product = {
      id: isEditing ? existingProduct!.id : `prod-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description || 'Tailored contemporary garment engineered for the TOOO collection.',
      shortDescription,
      category,
      collection,
      price,
      compareAtPrice: compareAtPrice > price ? compareAtPrice : undefined,
      images,
      availableColours: colours,
      availableSizes: selectedSizes,
      variants: finalVariants,
      stock: totalCalculatedStock,
      isFeatured,
      isNew,
      isBestSeller,
      fabricCare,
      details:
        isEditing && existingProduct?.details
          ? existingProduct.details
          : [
              'Architectural tailoring',
              'Drop shoulder profile',
              'Reinforced internal finishing',
            ],
      createdAt: isEditing ? existingProduct!.createdAt : new Date().toISOString().split('T')[0],
    };

    if (isEditing) {
      updateProduct(existingProduct!.id, payload);
    } else {
      addProduct(payload);
    }

    navigate('/admin/products');
  };

  const marginPercentage = price > 0 ? Math.round(((price - costPrice) / price) * 100) : 0;
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Link to="/admin/products" className="hover:text-neutral-900 flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>
      </div>

      <PageHeader
        title={isEditing ? `Edit: ${name}` : 'Create New Garment'}
        subtitle="Configure product attributes, photography, size variants, and inventory allocations."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/products')}
              className="px-4 py-2 border border-[#E9E7E3] bg-white text-xs font-semibold text-neutral-700 hover:bg-[#FAF8F5]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-[#171717] hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider"
            >
              {isEditing ? 'Save Changes' : 'Publish to Storefront'}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Basic Info */}
          <div className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-4">
            <h3 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wider pb-2 border-b border-[#E9E7E3]">
              1. Basic Information
            </h3>

            <div>
              <label className="text-xs font-semibold text-neutral-800 block mb-1">
                Product Title *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Double-Faced Wool Trench"
                className="w-full p-2.5 text-xs border border-[#E9E7E3] bg-[#FAF8F5] focus:outline-none focus:border-neutral-900"
              />
              {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. double-faced-wool-trench"
                  className="w-full p-2.5 text-xs font-mono border border-[#E9E7E3] bg-[#FAF8F5] focus:outline-none focus:border-neutral-900"
                />
                {errors.slug && <p className="text-[11px] text-rose-600 mt-1">{errors.slug}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full p-2.5 text-xs border border-[#E9E7E3] bg-[#FAF8F5] focus:outline-none focus:border-neutral-900"
                >
                  <option value="Outerwear">Outerwear</option>
                  <option value="Sets">Sets</option>
                  <option value="Tops">Tops</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-800 block mb-1">
                Collection
              </label>
              <input
                type="text"
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                placeholder="e.g. Architectural Tailoring"
                className="w-full p-2.5 text-xs border border-[#E9E7E3] bg-[#FAF8F5] focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-800 block mb-1">
                Full Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive tailoring details, drape silhouette, and tactile fabric story..."
                className="w-full p-2.5 text-xs border border-[#E9E7E3] bg-[#FAF8F5] focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          {/* Section 2: Product Photography */}
          <div className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-4">
            <h3 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wider pb-2 border-b border-[#E9E7E3]">
              2. Editorial Media & Images
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[3/4] bg-[#F6F3ED] border border-[#E9E7E3] group overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`Preview ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {idx === 0 && (
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-bold uppercase bg-black text-white px-1.5 py-0.5">
                      Cover
                    </span>
                  )}
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 bg-white/90 text-neutral-700 hover:text-rose-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Image input */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste Image URL or choose from atelier media library..."
                className="flex-1 p-2.5 text-xs border border-[#E9E7E3] bg-[#FAF8F5] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold"
              >
                Add Image
              </button>
            </div>
          </div>

          {/* Section 3: Variants */}
          <div className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-5">
            <h3 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wider pb-2 border-b border-[#E9E7E3]">
              3. Sizes & Colourways
            </h3>

            {/* Sizes selector */}
            <div>
              <span className="text-xs font-semibold text-neutral-800 block mb-2">
                Available Sizes
              </span>
              <div className="flex flex-wrap gap-2">
                {allSizes.map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${
                        isSelected
                          ? 'bg-[#171717] text-white border-[#171717]'
                          : 'bg-white text-neutral-700 border-[#E9E7E3] hover:border-neutral-500'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colours builder */}
            <div>
              <span className="text-xs font-semibold text-neutral-800 block mb-2">
                Colours
              </span>
              <div className="flex flex-wrap gap-2 mb-3">
                {colours.map((c, idx) => (
                  <div
                    key={c.name}
                    className="flex items-center gap-2 p-1.5 pr-2.5 border border-[#E9E7E3] bg-[#FAF8F5] text-xs font-medium text-neutral-800"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-neutral-300"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColour(idx)}
                      className="text-neutral-400 hover:text-rose-600 ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newColourName}
                  onChange={(e) => setNewColourName(e.target.value)}
                  placeholder="Colour name (e.g. Sage Olive)"
                  className="p-2 text-xs border border-[#E9E7E3] bg-[#FAF8F5] flex-1"
                />
                <input
                  type="color"
                  value={newColourHex}
                  onChange={(e) => setNewColourHex(e.target.value)}
                  className="w-9 h-8 border border-[#E9E7E3] cursor-pointer"
                />
                <button
                  type="button"
                  onClick={handleAddColour}
                  className="px-3 py-2 bg-neutral-900 text-white text-xs font-semibold"
                >
                  Add Colour
                </button>
              </div>
              {errors.colours && <p className="text-[11px] text-rose-600 mt-1">{errors.colours}</p>}
            </div>
          </div>

          {/* Section 4: Variant Matrix & Inventory Allocation */}
          <div className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-[#E9E7E3]">
              <div>
                <h3 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wider">
                  4. Variant Matrix & Inventory Allocation
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Size and colour combinations are tracked independently. Stock counts and SKUs are strictly preserved across edits.
                </p>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <span className="text-[11px] text-neutral-400 mr-1">Quick stock:</span>
                <button
                  type="button"
                  onClick={() => handleBatchSetStock(10)}
                  className="px-2 py-1 text-[10px] font-semibold bg-[#FAF8F5] border border-[#E9E7E3] hover:border-neutral-900 text-neutral-700"
                >
                  Set all 10
                </button>
                <button
                  type="button"
                  onClick={() => handleBatchSetStock(0)}
                  className="px-2 py-1 text-[10px] font-semibold bg-[#FAF8F5] border border-[#E9E7E3] hover:border-neutral-900 text-neutral-700"
                >
                  Set all 0
                </button>
              </div>
            </div>

            {errors.variants && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {errors.variants}
              </div>
            )}

            {/* Warning for retired variants with past customer orders */}
            {retiredVariantsWithOrders.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Order Safety Notice: Deselected Variants Have Historical Orders
                </div>
                <p className="text-[11px] text-amber-800">
                  The following variant combinations exist in previous customer orders:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {retiredVariantsWithOrders.map((rv) => (
                    <span
                      key={rv.variantId}
                      className="px-2 py-0.5 bg-white border border-amber-300 text-[10px] font-mono text-amber-900"
                    >
                      {rv.size} · {rv.colour} (Stock: {rv.stock})
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-amber-700 pt-1">
                  Re-select these sizes and colours if you intend to maintain fulfillment or restocking capability.
                </p>
              </div>
            )}

            {/* Matrix Table */}
            <div className="overflow-x-auto border border-[#E9E7E3]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E9E7E3] text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                    <th className="py-2.5 px-3">Variant (Size / Colour)</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3 w-28">Allocated Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E7E3] text-xs">
                  {computedActiveVariants.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-neutral-400">
                        Please select at least one size and add at least one colour above.
                      </td>
                    </tr>
                  ) : (
                    computedActiveVariants.map((v) => (
                      <tr key={v.key} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-neutral-300 shrink-0"
                              style={{ backgroundColor: v.colourHex }}
                            />
                            <span className="font-medium text-neutral-900">{v.colour}</span>
                            <span className="px-1.5 py-0.5 bg-neutral-100 text-[10px] font-bold text-neutral-800 rounded">
                              {v.size}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          {v.isExisting ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Preserved
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              New Variant
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={v.sku}
                            onChange={(e) => handleVariantSkuChange(v.key, e.target.value)}
                            placeholder="e.g. TOOO-TREN-S-BLK"
                            className="w-full py-1 px-2 text-xs font-mono border border-[#E9E7E3] bg-[#FAF8F5] focus:outline-none focus:border-neutral-900"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="number"
                            min={0}
                            value={v.stock}
                            onChange={(e) => handleVariantStockChange(v.key, Number(e.target.value))}
                            className="w-full py-1 px-2 text-xs font-bold tabular-nums border border-[#E9E7E3] bg-[#FAF8F5] focus:outline-none focus:border-neutral-900 text-right"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 text-neutral-500">
              <span>
                Total Variants: <strong className="text-neutral-900">{computedActiveVariants.length}</strong>
              </span>
              <span>
                Total Catalogue Stock:{' '}
                <strong className="text-neutral-900">
                  {computedActiveVariants.reduce((sum, v) => sum + (v.stock || 0), 0)} units
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Publishing Status */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pricing Panel */}
          <div className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-4">
            <h3 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wider pb-2 border-b border-[#E9E7E3]">
              Pricing & Margin
            </h3>

            <div>
              <label className="text-xs font-semibold text-neutral-800 block mb-1">
                Selling Price (NGN ₦) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-2.5 text-xs font-bold tabular-nums border border-[#E9E7E3] bg-[#FAF8F5]"
              />
              {errors.price && <p className="text-[11px] text-rose-600 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-800 block mb-1">
                Compare-at Price (Strike-through)
              </label>
              <input
                type="number"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(Number(e.target.value))}
                className="w-full p-2.5 text-xs tabular-nums border border-[#E9E7E3] bg-[#FAF8F5]"
              />
              {errors.compareAtPrice && <p className="text-[11px] text-rose-600 mt-1">{errors.compareAtPrice}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-800 block mb-1">
                Atelier Cost Per Unit
              </label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full p-2.5 text-xs tabular-nums border border-[#E9E7E3] bg-[#FAF8F5]"
              />
              {errors.costPrice && <p className="text-[11px] text-rose-600 mt-1">{errors.costPrice}</p>}
            </div>

            <div className="pt-2 border-t border-[#E9E7E3] text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-500">Gross Margin:</span>
                <span className="font-bold text-emerald-800 tabular-nums">{marginPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Gross Profit:</span>
                <span className="font-bold text-neutral-900 tabular-nums">
                  {formatNaira(Math.max(0, price - costPrice))}
                </span>
              </div>
            </div>
          </div>

          {/* Visibility Badges */}
          <div className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-3">
            <h3 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wider pb-2 border-b border-[#E9E7E3]">
              Publishing & Badges
            </h3>

            <label className="flex items-center gap-2.5 text-xs text-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="w-4 h-4 accent-[#171717]"
              />
              <span>Mark as New Arrival</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#171717]"
              />
              <span>Feature on Homepage Collection</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="w-4 h-4 accent-[#171717]"
              />
              <span>Mark as Bestselling Silhouette</span>
            </label>
          </div>

          {/* SEO Preview Card */}
          <div className="bg-[#FAF8F5] border border-[#E9E7E3] p-4 text-xs space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Search Engine Preview
            </span>
            <div className="text-blue-700 font-medium truncate">
              {name || 'New Garment'} — TOOO STORE
            </div>
            <div className="text-emerald-800 text-[11px] truncate">
              https://tooostore.example/product/{slug || 'new-product'}
            </div>
            <p className="text-neutral-500 text-[11px] line-clamp-2">
              {description || 'Tailored contemporary garment engineered for the TOOO collection.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
