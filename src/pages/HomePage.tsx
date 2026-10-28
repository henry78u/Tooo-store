import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import { ProductCard } from '../components/commerce/ProductCard';
import { CATEGORIES_DATA, EDITORIAL_GALLERY, HERO_IMAGE, STORY_IMAGE } from '../data/products';
import { useStore } from '../store/useStore';
import { useAdminStore } from '../store/useAdminStore';
import { useCommerceProducts } from '../services/commerceService';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setQuickViewProduct } = useStore();
  const products = useCommerceProducts();
  const homepageSections = useAdminStore((s) => s.homepageSections);

  const heroSec = homepageSections.find((s) => s.id === 'sec-hero');
  const campaignSec = homepageSections.find((s) => s.id === 'sec-campaign');
  const storySec = homepageSections.find((s) => s.id === 'sec-story');
  const categoriesSec = homepageSections.find((s) => s.id === 'sec-categories');
  const newArrivalsSec = homepageSections.find((s) => s.id === 'sec-new-arrivals');
  const bestsellersSec = homepageSections.find((s) => s.id === 'sec-bestsellers');

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const addToast = useStore((s) => s.addToast);

  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterSubscribed(true);
    addToast({
      title: 'Subscribed to The TOOO Edit',
      description: 'You will receive seasonal drops and private invitations.',
      type: 'success',
    });
    setNewsletterEmail('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1: Full-Width Campaign Hero */}
      {heroSec?.enabled !== false && (
        <section className="relative w-full h-[88vh] min-h-[580px] max-h-[920px] bg-[#171717] overflow-hidden flex items-end">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={heroSec?.image || HERO_IMAGE}
              alt="TOOO STORE Autumn/Winter Editorial Campaign"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top filter brightness-[0.88] contrast-[1.04]"
            />
            {/* Measured contrast scrim gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
          </div>

          {/* Hero Content Overlay */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20">
            <div className="max-w-2xl space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] text-[#D8D0C5] font-semibold block">
                {heroSec?.subheadline || 'TOOO. Collection · Atelier Edit'}
              </span>
              <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.04] text-balance">
                {heroSec?.headline || 'STYLE WITHOUT LIMITS.'}
              </h1>
              <p className="text-sm sm:text-base text-neutral-200 font-normal leading-relaxed max-w-lg">
                Discover pieces that define your everyday expression. Engineered silhouettes crafted to be worn and seen.
              </p>

              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to={heroSec?.ctaLink || '/shop'}
                  className="bg-white text-[#171717] hover:bg-[#F6F3ED] text-xs font-semibold uppercase tracking-wider py-4 px-8 text-center transition-all duration-200 shadow-lg"
                >
                  {heroSec?.ctaText || 'Shop the Collection'}
                </Link>
                <Link
                  to="/shop?sort=newest"
                  className="border border-white/60 hover:border-white text-white bg-black/20 hover:bg-black/40 backdrop-blur-xs text-xs font-semibold uppercase tracking-wider py-4 px-8 text-center transition-all duration-200"
                >
                  Explore New Arrivals
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trust & Guarantee Strip */}
      <section className="bg-[#F6F3ED] border-b border-[#E9E7E3] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left text-xs text-neutral-700">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <Truck className="w-4 h-4 text-[#8A4735] shrink-0" />
              <span>Complimentary Lagos delivery on orders over ₦100,000</span>
            </div>
            <div className="flex items-center justify-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-[#8A4735] shrink-0" />
              <span>14-day seamless exchange & bespoke sizing support</span>
            </div>
            <div className="flex items-center justify-center md:justify-end gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#8A4735] shrink-0" />
              <span>Authentic heavy-gauge materials & crafted tailored finish</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Shop by Category */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[11px] font-semibold text-[#8A4735] uppercase tracking-[0.2em] block mb-1">
              Curated Taxonomy
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#171717] tracking-tight">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-neutral-800 hover:text-[#8A4735] flex items-center gap-1 transition-colors group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES_DATA.slice(0, 3).map((category) => (
            <Link
              key={category.slug}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group relative aspect-[4/5] bg-[#F6F3ED] overflow-hidden flex flex-col justify-end p-6 border border-[#E9E7E3]"
            >
              <img
                src={category.image}
                alt={category.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity group-hover:opacity-90" />
              <div className="relative z-10 text-white space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D8D0C5]">
                  {category.itemCount}
                </span>
                <h3 className="font-display font-semibold text-xl text-white">
                  {category.name}
                </h3>
                <p className="text-xs text-neutral-300 line-clamp-1">
                  {category.description}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs font-medium text-white group-hover:text-[#D8D0C5] transition-colors">
                  <span>Explore category</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 3: New Arrivals */}
      <section className="bg-[#FAF8F5] py-16 sm:py-24 border-y border-[#E9E7E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] font-semibold text-[#8A4735] uppercase tracking-[0.2em] block mb-1">
                Fresh Release
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#171717] tracking-tight">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop?sort=newest"
              className="text-xs font-semibold text-neutral-800 hover:text-[#8A4735] flex items-center gap-1 transition-colors group"
            >
              <span>See All Arrivals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickAdd={() => setQuickViewProduct(product)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Editorial Campaign Banner */}
      {campaignSec?.enabled !== false && (
        <section className="relative w-full py-24 sm:py-32 bg-[#171717] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <img
              src={campaignSec?.image || STORY_IMAGE}
              alt="Editorial Campaign"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/40" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl space-y-4">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8A4735]">
                {campaignSec?.subheadline || 'Volume 01 · Contemporary Expression'}
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-white leading-tight">
                {campaignSec?.headline || 'WEAR YOUR CONFIDENCE.'}
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                Everyday essentials. Elevated expression. Designed with architectural restraint to seamlessly adapt between high occasions and daily urban motion.
              </p>
              <div className="pt-2">
                <Link
                  to={campaignSec?.ctaLink || '/collections'}
                  className="inline-flex items-center gap-2 bg-white text-[#171717] hover:bg-[#F6F3ED] text-xs font-semibold uppercase tracking-wider py-3.5 px-7 transition-colors"
                >
                  <span>{campaignSec?.ctaText || 'Discover the Collection'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5: Bestsellers */}
      {bestsellersSec?.enabled !== false && (
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] font-semibold text-[#8A4735] uppercase tracking-[0.2em] block mb-1">
                {bestsellersSec?.subheadline || 'Client Favorites'}
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#171717] tracking-tight">
                {bestsellersSec?.headline || 'Bestselling Silhouettes'}
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-semibold text-neutral-800 hover:text-[#8A4735] flex items-center gap-1 transition-colors group"
            >
              <span>Explore All Pieces</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickAdd={() => setQuickViewProduct(product)}
              />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 6: Brand Story (Split Screen) */}
      {storySec?.enabled !== false && (
        <section className="bg-[#F6F3ED] border-y border-[#E9E7E3] py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Image */}
              <div className="lg:col-span-6">
                <div className="aspect-[4/5] bg-white overflow-hidden shadow-sm border border-[#E9E7E3]">
                  <img
                    src={storySec?.image || STORY_IMAGE}
                    alt="TOOO Atelier Craftsman"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right Story Content */}
              <div className="lg:col-span-6 space-y-5 lg:pl-6">
                <span className="text-[11px] font-bold text-[#8A4735] uppercase tracking-[0.25em] block">
                  {storySec?.subheadline || 'The TOOO Story'}
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#171717] tracking-tight">
                  {storySec?.headline || 'More Than What You Wear.'}
                </h2>
                <div className="space-y-4 text-sm text-neutral-700 leading-relaxed">
                  <p>
                    TOOO STORE was established on the principle that clothing is an architecture of self-possession. Founded with deep contemporary roots, our garments bridge relaxed comfort with strict tailoring discipline.
                  </p>
                  <p>
                    We prioritize heavy-gauge natural fibers, custom-milled loopback cotton, and double-faced wool blends engineered to hold their shape through countless wears. Every seam, cuff, and drop shoulder is drawn with intentional purpose.
                  </p>
                </div>

                <div className="pt-3">
                  <Link
                    to={storySec?.ctaLink || '/about'}
                    className="inline-flex items-center gap-2 border border-[#171717] text-[#171717] hover:bg-[#171717] hover:text-white px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    <span>{storySec?.ctaText || 'Discover Our Story'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 7: Instagram-Inspired Lookbook Gallery */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-[11px] font-bold text-[#8A4735] uppercase tracking-[0.25em]">
            Visual Journal
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#171717]">
            THE TOOO EDIT
          </h2>
          <p className="text-xs text-neutral-500">
            Follow @tooostore for backstage lookbook previews, material sourcing journals, and community stylings.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {EDITORIAL_GALLERY.map((item, index) => (
            <div
              key={index}
              className="group relative aspect-[3/4] bg-[#F6F3ED] overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4 text-white text-xs">
                <span className="font-medium text-xs line-clamp-1">{item.caption}</span>
                <span className="text-[10px] text-neutral-300 mt-0.5">{item.tag}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 hover:text-[#8A4735] transition-colors"
          >
            <span>Follow on Instagram</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* SECTION 8: Minimal Newsletter Section */}
      <section className="bg-[#171717] text-white py-16 sm:py-20 border-t border-neutral-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <span className="text-[11px] font-bold text-[#8A4735] uppercase tracking-[0.25em]">
            Stay in the Loop
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            BE FIRST FOR THE NEXT DROP.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            Sign up to receive early access to capsule collections, archive sales, and private editorial lookbooks.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="pt-2 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 px-4 py-3 text-xs focus:outline-none focus:border-white transition-colors"
            />
            <button
              type="submit"
              className="bg-white text-neutral-900 hover:bg-[#F6F3ED] text-xs font-semibold px-6 py-3 transition-colors shrink-0"
            >
              Join Circle
            </button>
          </form>
          {newsletterSubscribed && (
            <p className="text-xs text-emerald-400">
              ✓ You are subscribed to TOOO STORE releases.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
