import React from 'react';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'accent';

interface StatusBadgeProps {
  status: string;
  tone?: BadgeTone;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  tone,
  showDot = false,
}) => {
  // Infer tone if not provided
  let determinedTone: BadgeTone = tone || 'neutral';
  const lower = status.toLowerCase();

  if (!tone) {
    if (
      lower.includes('paid') ||
      lower.includes('delivered') ||
      lower.includes('active') ||
      lower.includes('approved') ||
      lower.includes('successful') ||
      lower.includes('in stock')
    ) {
      determinedTone = 'success';
    } else if (
      lower.includes('processing') ||
      lower.includes('shipped') ||
      lower.includes('pending') ||
      lower.includes('low') ||
      lower.includes('review')
    ) {
      determinedTone = 'warning';
    } else if (
      lower.includes('cancel') ||
      lower.includes('failed') ||
      lower.includes('reject') ||
      lower.includes('out of stock') ||
      lower.includes('suspended')
    ) {
      determinedTone = 'danger';
    } else if (lower.includes('new') || lower.includes('vip') || lower.includes('featured')) {
      determinedTone = 'accent';
    }
  }

  const toneStyles: Record<BadgeTone, string> = {
    neutral: 'bg-neutral-100 text-neutral-700 border-neutral-300',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    accent: 'bg-[#F6F3ED] text-[#8A4735] border-[#D8D0C5]',
  };

  const dotStyles: Record<BadgeTone, string> = {
    neutral: 'bg-neutral-500',
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    danger: 'bg-rose-600',
    accent: 'bg-[#8A4735]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider border rounded-none ${toneStyles[determinedTone]}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[determinedTone]}`} />}
      <span>{status}</span>
    </span>
  );
};
