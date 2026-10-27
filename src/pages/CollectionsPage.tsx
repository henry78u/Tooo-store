import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { HERO_IMAGE, STORY_IMAGE, OUTERWEAR_CAT_IMAGE, SETS_CAT_IMAGE } from '../data/products';

const COLLECTIONS = [
  {
    title: 'The Monochrome Drop',
    subtitle: 'High-contrast minimalist streetwear and 480 GSM knitwear',
    image: HERO_IMAGE,
    piecesCount: '6 Silhouettes',
    filterParam: 'The Monochrome Drop',
    description: 'Black, graphite, and raw natural textures crafted with sculptural architectural proportions for fluid city navigation.',
  },
  {
    title: 'Architectural Tailoring',
    subtitle: 'Double-breasted overcoats, deep front pleats, and crisp poplin',
    image: OUTERWEAR_CAT_IMAGE,
    piecesCount: '5 Silhouettes',
    filterParam: 'Architectural Tailoring',
    description: 'Deconstructed suiting and heavy double-faced wool blends that bridge boardroom presence with nonchalant elegance.',
  },
  {
    title: 'Everyday Essentials',
    subtitle: '300 GSM box tees, French terry coordinate sets, and waxed canvas',
    image: SETS_CAT_IMAGE,
    piecesCount: '5 Silhouettes',
    filterParam: 'Everyday Essentials',
    description: 'Foundational garments with unbreakable collar ribs and tactile organic fibers made to be worn daily.',
  },
];

export const CollectionsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-14">
        <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8A4735] block mb-1">
          Seasonal Direction
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#171717]">
          Curated Collections
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-2">
          Cohesive seasonal edits exploring material depth, sculptural drape, and contemporary proportion.
        </p>
      </div>

      <div className="space-y-12">
        {COLLECTIONS.map((col, idx) => (
          <div
            key={col.title}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF8F5] border border-[#E9E7E3] overflow-hidden ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            <div className={`lg:col-span-7 aspect-[16/10] overflow-hidden ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
              <img
                src={col.image}
                alt={col.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className={`lg:col-span-5 p-8 lg:p-10 space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8A4735]">
                {col.piecesCount}
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-900">
                {col.title}
              </h2>
              <p className="text-xs font-medium text-neutral-700">
                {col.subtitle}
              </p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {col.description}
              </p>

              <div className="pt-2">
                <Link
                  to={`/shop`}
                  className="inline-flex items-center gap-2 bg-[#171717] hover:bg-neutral-800 text-white text-xs font-semibold py-3 px-6 transition-colors"
                >
                  <span>Shop This Capsule</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
