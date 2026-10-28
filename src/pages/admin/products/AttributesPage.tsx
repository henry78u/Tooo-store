import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { Plus, Trash2 } from 'lucide-react';

export const AttributesPage: React.FC = () => {
  const [sizes, setSizes] = useState(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE']);
  const [newSize, setNewSize] = useState('');

  const [colours, setColours] = useState([
    { name: 'Oatmeal Beige', hex: '#D8D0C5' },
    { name: 'Pitch Black', hex: '#171717' },
    { name: 'Terracotta Earth', hex: '#8A4735' },
    { name: 'Caramel Camel', hex: '#9C6F44' },
    { name: 'Vintage Black', hex: '#262626' },
    { name: 'Sage Olive', hex: '#707A65' },
    { name: 'Ivory Cream', hex: '#F7F4EC' },
  ]);
  const [newColourName, setNewColourName] = useState('');
  const [newColourHex, setNewColourHex] = useState('#8A4735');

  const [fabrics, setFabrics] = useState([
    'Double-Faced Wool Blend (70% Wool, 30% Cashmere)',
    'Organic GOTS French Terry Cotton (480 GSM)',
    'Combed Compact Cotton (300 GSM)',
    'European Flax Linen (100%)',
    'Japanese Nylon Ripstop (Water-repellent)',
    'Mongolian Grade-A Cashmere',
  ]);
  const [newFabric, setNewFabric] = useState('');

  const handleAddSize = () => {
    if (!newSize.trim() || sizes.includes(newSize.trim().toUpperCase())) return;
    setSizes([...sizes, newSize.trim().toUpperCase()]);
    setNewSize('');
  };

  const handleAddColour = () => {
    if (!newColourName.trim()) return;
    setColours([...colours, { name: newColourName.trim(), hex: newColourHex }]);
    setNewColourName('');
  };

  const handleAddFabric = () => {
    if (!newFabric.trim()) return;
    setFabrics([...fabrics, newFabric.trim()]);
    setNewFabric('');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Product Attributes & Options"
        subtitle="Manage standardized clothing sizes, atelier colour palettes, and fabric classifications."
        breadcrumbs={[{ label: 'Products' }, { label: 'Attributes' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Sizes */}
        <div className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-neutral-900 pb-2 border-b border-[#E9E7E3]">
            Standard Sizing Scale
          </h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s, idx) => (
              <div
                key={s}
                className="px-3 py-1.5 border border-[#E9E7E3] bg-[#FAF8F5] text-xs font-semibold text-neutral-800 flex items-center gap-2"
              >
                <span>{s}</span>
                <button
                  onClick={() => setSizes(sizes.filter((_, i) => i !== idx))}
                  className="text-neutral-400 hover:text-rose-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="e.g. 3XL"
              className="flex-1 p-2 text-xs border border-[#E9E7E3] bg-[#FAF8F5]"
            />
            <button
              onClick={handleAddSize}
              className="px-3 py-1.5 bg-[#171717] text-white text-xs font-semibold"
            >
              Add Size
            </button>
          </div>
        </div>

        {/* Colours */}
        <div className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-neutral-900 pb-2 border-b border-[#E9E7E3]">
            Atelier Colour Swatches
          </h3>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
            {colours.map((c, idx) => (
              <div
                key={c.name}
                className="flex items-center justify-between p-2 border border-[#E9E7E3] bg-[#FAF8F5]"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-4 h-4 rounded-full border border-neutral-300"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="font-medium text-neutral-900">{c.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[11px]">{c.hex}</span>
                  <button
                    onClick={() => setColours(colours.filter((_, i) => i !== idx))}
                    className="text-neutral-400 hover:text-rose-600 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newColourName}
              onChange={(e) => setNewColourName(e.target.value)}
              placeholder="Name"
              className="flex-1 p-2 text-xs border border-[#E9E7E3] bg-[#FAF8F5]"
            />
            <input
              type="color"
              value={newColourHex}
              onChange={(e) => setNewColourHex(e.target.value)}
              className="w-9 h-8 border border-[#E9E7E3] cursor-pointer"
            />
            <button
              onClick={handleAddColour}
              className="px-3 py-1.5 bg-[#171717] text-white text-xs font-semibold"
            >
              Add
            </button>
          </div>
        </div>

        {/* Fabric compositions */}
        <div className="bg-white border border-[#E9E7E3] p-5 sm:p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-neutral-900 pb-2 border-b border-[#E9E7E3]">
            Fabric & Fiber Standards
          </h3>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
            {fabrics.map((f, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between p-2 border border-[#E9E7E3] bg-[#FAF8F5]"
              >
                <span className="font-medium text-neutral-800 leading-snug">{f}</span>
                <button
                  onClick={() => setFabrics(fabrics.filter((_, i) => i !== idx))}
                  className="text-neutral-400 hover:text-rose-600 p-0.5 shrink-0 ml-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newFabric}
              onChange={(e) => setNewFabric(e.target.value)}
              placeholder="e.g. 100% Pima Cotton (240 GSM)"
              className="flex-1 p-2 text-xs border border-[#E9E7E3] bg-[#FAF8F5]"
            />
            <button
              onClick={handleAddFabric}
              className="px-3 py-1.5 bg-[#171717] text-white text-xs font-semibold"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
