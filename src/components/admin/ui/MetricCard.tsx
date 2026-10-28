import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface TrendData {
  value: string | number;
  isPositive?: boolean;
  direction?: 'up' | 'down' | 'neutral';
  label?: string;
}

export interface ComparisonData {
  label?: string;
  value?: string | number;
  period?: string;
}

export interface MetricCardProps {
  /** Metric headline/title */
  title?: string;
  /** Backward-compatible alias for title */
  label?: string;
  /** Primary metric measurement or currency value */
  value: string | number;
  /** Trend data (delta percentage or object with direction) */
  trend?: TrendData | string | number;
  /** Optional comparison data (e.g. previous period, benchmark, or target) */
  comparisonData?: ComparisonData | string;
  /** Backward-compatible delta string (e.g. "+18.4%") */
  change?: string;
  /** Backward-compatible delta type */
  changeType?: 'positive' | 'negative' | 'neutral';
  /** Secondary supplementary caption */
  subtext?: string;
  /** Decorative or domain icon */
  icon?: React.ReactNode;
  /** Optional navigation target */
  linkTo?: string;
  /** Optional navigation label */
  linkText?: string;
  /** Optional custom CSS classes */
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  label,
  value,
  trend,
  comparisonData,
  change,
  changeType,
  subtext,
  icon,
  linkTo,
  linkText,
  className = '',
}) => {
  const displayTitle = title || label || '';

  // Resolve normalized trend information
  let trendValue: string | number | undefined;
  let trendDirection: 'positive' | 'negative' | 'neutral' = changeType || 'neutral';
  let trendLabel: string | undefined = subtext;

  if (trend !== undefined) {
    if (typeof trend === 'object' && trend !== null) {
      trendValue = trend.value;
      if (trend.isPositive !== undefined) {
        trendDirection = trend.isPositive ? 'positive' : 'negative';
      } else if (trend.direction) {
        trendDirection = trend.direction === 'up' ? 'positive' : trend.direction === 'down' ? 'negative' : 'neutral';
      } else {
        const strVal = String(trend.value);
        trendDirection = strVal.startsWith('-') ? 'negative' : strVal.startsWith('+') ? 'positive' : 'neutral';
      }
      if (trend.label) {
        trendLabel = trend.label;
      }
    } else {
      trendValue = trend;
      const strVal = String(trend);
      if (strVal.startsWith('+')) {
        trendDirection = 'positive';
      } else if (strVal.startsWith('-')) {
        trendDirection = 'negative';
      } else {
        trendDirection = changeType || 'positive';
      }
    }
  } else if (change) {
    trendValue = change;
    trendDirection = changeType || (change.startsWith('-') ? 'negative' : change.startsWith('+') ? 'positive' : 'neutral');
  }

  // Resolve comparison data
  let compLabel: string | undefined;
  let compValue: string | number | undefined;
  let compPeriod: string | undefined;

  if (comparisonData) {
    if (typeof comparisonData === 'object' && comparisonData !== null) {
      compLabel = comparisonData.label || 'Prior Period';
      compValue = comparisonData.value;
      compPeriod = comparisonData.period;
    } else {
      compValue = comparisonData;
    }
  }

  return (
    <div
      className={`bg-white border border-[#E9E7E3] p-5 flex flex-col justify-between transition-all hover:border-neutral-400 shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${className}`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-semibold text-[#77746F] uppercase tracking-wider font-mono">
            {displayTitle}
          </span>
          {icon && (
            <div className="w-8 h-8 rounded-none bg-[#F6F3ED] border border-[#E9E7E3] flex items-center justify-center text-[#171717] shrink-0">
              {icon}
            </div>
          )}
        </div>

        {/* Primary Value */}
        <div className="my-2.5">
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-[#171717] tabular-nums tracking-tight">
            {value}
          </div>
        </div>
      </div>

      {/* Footer: Trend, Comparison & Deep Link */}
      <div className="pt-3 border-t border-[#E9E7E3] space-y-2">
        <div className="flex items-center justify-between text-xs flex-wrap gap-1">
          {trendValue !== undefined && (
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-0.5 font-mono text-xs font-semibold ${
                  trendDirection === 'positive'
                    ? 'text-emerald-700'
                    : trendDirection === 'negative'
                    ? 'text-rose-700'
                    : 'text-[#77746F]'
                }`}
              >
                {trendDirection === 'positive' && <ArrowUpRight className="w-3.5 h-3.5" />}
                {trendDirection === 'negative' && <ArrowDownRight className="w-3.5 h-3.5" />}
                {trendDirection === 'neutral' && <Minus className="w-3.5 h-3.5" />}
                <span>{trendValue}</span>
              </span>
              {trendLabel && (
                <span className="text-[#77746F] text-[11px] font-normal truncate">
                  {trendLabel}
                </span>
              )}
            </div>
          )}

          {linkTo && (
            <Link
              to={linkTo}
              className="text-[11px] font-mono uppercase tracking-wider text-[#8A4735] hover:underline ml-auto"
            >
              {linkText || 'Inspect →'}
            </Link>
          )}
        </div>

        {/* Optional Comparison Data Panel */}
        {(compValue !== undefined || compPeriod) && (
          <div className="pt-1.5 border-t border-dashed border-[#E9E7E3] flex items-center justify-between text-[11px] text-[#77746F] font-mono">
            <span className="text-neutral-500">
              {compLabel ? `${compLabel}:` : compPeriod || 'Baseline:'}
            </span>
            <span className="font-semibold text-[#171717] tabular-nums">
              {compValue}
              {compPeriod && !compLabel && <span className="font-normal text-[#77746F] ml-1">({compPeriod})</span>}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
