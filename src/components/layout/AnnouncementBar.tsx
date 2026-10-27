import React, { useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ANNOUNCEMENTS = [
  {
    text: 'Discover the latest arrivals at TOOO STORE.',
    linkText: 'Explore New In',
    linkUrl: '/shop?filter=new',
  },
  {
    text: 'Complimentary shipping across Lagos on orders over ₦100,000.',
    linkText: 'Learn More',
    linkUrl: '/track-order',
  },
  {
    text: 'Editorial Campaign: Wear Your Confidence · Use code TOOO10 for 10% off.',
    linkText: 'Shop Collection',
    linkUrl: '/shop',
  },
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const current = ANNOUNCEMENTS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  return (
    <aside 
      aria-label="Announcements" 
      className="bg-[#171717] text-[#F6F3ED] text-xs py-2 px-4 transition-all duration-200 border-b border-neutral-800"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <button
          onClick={handleNext}
          className="text-neutral-400 hover:text-white transition-colors text-[11px] uppercase tracking-wider hidden sm:block shrink-0"
          title="Next message"
        >
          Notice
        </button>

        <div className="flex-1 text-center truncate flex items-center justify-center gap-2">
          <span className="truncate tracking-wide">{current.text}</span>
          <Link
            to={current.linkUrl}
            className="underline underline-offset-4 font-medium text-white hover:text-neutral-300 transition-colors inline-flex items-center gap-0.5 shrink-0"
          >
            <span>{current.linkText}</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-neutral-400 hover:text-white transition-colors p-0.5 shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
