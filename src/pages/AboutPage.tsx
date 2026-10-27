import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Shield, Feather, Sparkles } from 'lucide-react';
import { STORY_IMAGE, HERO_IMAGE } from '../data/products';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
      {/* Hero Brand Statement */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
        <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8A4735] block">
          The TOOO Philosophy
        </span>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#171717] tracking-tight leading-[1.08]">
          Made to Be Worn.<br />Made to Be Seen.
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-light pt-2">
          TOOO STORE exists to eliminate the compromise between relaxed streetwear comfort and high architectural tailoring. We construct enduring clothing for the modern eye.
        </p>
      </div>

      {/* Large Visual Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-stretch">
        <div className="lg:col-span-7 aspect-[16/10] bg-[#F6F3ED] overflow-hidden border border-[#E9E7E3]">
          <img
            src={HERO_IMAGE}
            alt="TOOO Atelier Vision"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-5 bg-[#FAF8F5] p-8 lg:p-12 border border-[#E9E7E3] flex flex-col justify-center space-y-4">
          <span className="text-[11px] font-bold text-[#8A4735] uppercase tracking-wider">
            Origins & Architecture
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 leading-tight">
            More Than What You Wear.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Founded with contemporary Lagos roots and global sensibilities, TOOO began as an exercise in silhouette restraint. We asked what happens when everyday essentials are stripped of unnecessary logos and given the heavyweight integrity of bespoke tailoring.
          </p>
          <p className="text-xs text-neutral-500 leading-relaxed">
            The answer is a permanent wardrobe of interchangeable pieces—from 480 GSM custom loopback fleece to double-faced wool overcoats with dropped shoulders.
          </p>
        </div>
      </div>

      {/* Three Pillars of Craftsmanship */}
      <div className="border-y border-[#E9E7E3] py-16 mb-20">
        <div className="text-center max-w-lg mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A4735]">
            Design Constitution
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 mt-1">
            Three Enduring Commitments
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3 p-6 bg-[#FAF8F5] border border-[#E9E7E3]">
            <Compass className="w-6 h-6 text-[#8A4735]" />
            <h3 className="font-display font-semibold text-lg text-neutral-900">
              Architectural Proportions
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every drop shoulder, wide leg pleat, and curved overshirt hem is drafted to establish presence without sacrificing effortless movement.
            </p>
          </div>

          <div className="space-y-3 p-6 bg-[#FAF8F5] border border-[#E9E7E3]">
            <Shield className="w-6 h-6 text-[#8A4735]" />
            <h3 className="font-display font-semibold text-lg text-neutral-900">
              Heavy-Gauge Fiber Integrity
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We insist on dense 300-480 GSM cottons, Mongolian Grade-A cashmere, and genuine double-faced wool that improve with every cycle of wear.
            </p>
          </div>

          <div className="space-y-3 p-6 bg-[#FAF8F5] border border-[#E9E7E3]">
            <Feather className="w-6 h-6 text-[#8A4735]" />
            <h3 className="font-display font-semibold text-lg text-neutral-900">
              Quiet Branding Restraint
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              No loud graphics or disposable marketing slogans. Our signature is recognized by texture, geometry, and subtle tonal embroidery.
            </p>
          </div>
        </div>
      </div>

      {/* Split Story Editorial */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
        <div className="lg:col-span-6 space-y-5">
          <span className="text-[11px] font-bold text-[#8A4735] uppercase tracking-wider">
            Client Atelier
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-900">
            Engineered in Lagos. Distributed Worldwide.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Our atelier coordinates localized Nigerian couriers for rapid 24-48 hour delivery within Lagos and express transit nationwide to Abuja, Port Harcourt, and beyond.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#171717] hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider py-3 px-6 transition-colors"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6 aspect-[4/3] bg-[#F6F3ED] overflow-hidden border border-[#E9E7E3]">
          <img
            src={STORY_IMAGE}
            alt="TOOO Contemporary Stylings"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
