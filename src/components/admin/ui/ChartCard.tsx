import React, { useState } from 'react';
import { formatNaira } from '../../../store/useStore';

interface DataPoint {
  label: string;
  value: number;
  prevValue?: number;
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  isCurrency?: boolean;
  timeframes?: string[];
  onTimeframeChange?: (timeframe: string) => void;
  summaryValue?: string;
  summaryTrend?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  data,
  isCurrency = true,
  timeframes = ['7D', '30D', '90D', '12M'],
  summaryValue,
  summaryTrend,
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState(timeframes[1] || '30D');
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  const maxValue = Math.max(...data.map((d) => d.value), 100);
  const chartHeight = 220;
  const chartWidth = 600;
  const paddingX = 40;
  const paddingY = 25;

  const points = data.map((d, idx) => {
    const x = paddingX + (idx / Math.max(data.length - 1, 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d.value / maxValue) * (chartHeight - paddingY * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : '';

  return (
    <div className="bg-white border border-[#E9E7E3] p-5 sm:p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E9E7E3]">
        <div>
          <span className="text-[11px] font-semibold text-[#8A4735] uppercase tracking-wider block">
            Performance Curve
          </span>
          <h3 className="font-display font-bold text-lg text-[#171717]">{title}</h3>
          {subtitle && <p className="text-xs text-[#77746F] mt-0.5">{subtitle}</p>}
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 bg-[#F6F3ED] p-1 border border-[#E9E7E3] self-start sm:self-auto">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTimeframe === tf
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Row */}
      {summaryValue && (
        <div className="pt-4 pb-2 flex items-baseline gap-3">
          <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#171717] tabular-nums">
            {summaryValue}
          </span>
          {summaryTrend && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
              {summaryTrend}
            </span>
          )}
        </div>
      )}

      {/* SVG Chart Frame */}
      <div className="relative w-full pt-4 overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-48 sm:h-56 overflow-visible"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#171717" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#171717" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={chartHeight - paddingY}
            x2={chartWidth - paddingX}
            y2={chartHeight - paddingY}
            stroke="#E9E7E3"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={chartHeight / 2}
            x2={chartWidth - paddingX}
            y2={chartHeight / 2}
            stroke="#E9E7E3"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={paddingY}
            x2={chartWidth - paddingX}
            y2={paddingY}
            stroke="#E9E7E3"
            strokeDasharray="4 4"
            strokeWidth="1"
          />

          {/* Area fill */}
          {areaD && <path d={areaD} fill="url(#areaGradient)" />}

          {/* Line stroke */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#171717"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive points */}
          {points.map((p, idx) => (
            <g key={idx} onMouseEnter={() => setHoveredPoint(p)} onMouseLeave={() => setHoveredPoint(null)}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredPoint?.label === p.label ? 5 : 3}
                fill={hoveredPoint?.label === p.label ? '#8A4735' : '#171717'}
                stroke="#FFFFFF"
                strokeWidth="2"
                className="cursor-pointer transition-all"
              />
            </g>
          ))}
        </svg>

        {/* Dynamic Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-2 right-2 bg-[#171717] text-white p-2.5 text-xs shadow-md border border-neutral-700 pointer-events-none">
            <span className="text-neutral-400 block text-[10px] uppercase font-semibold">
              {hoveredPoint.label}
            </span>
            <span className="font-bold text-sm tabular-nums">
              {isCurrency ? formatNaira(hoveredPoint.value) : `${hoveredPoint.value.toLocaleString()} units`}
            </span>
          </div>
        )}

        {/* Bottom X-axis labels */}
        <div className="flex justify-between items-center text-[11px] text-neutral-400 pt-2 px-4 border-t border-[#E9E7E3]">
          {data.slice(0, 6).map((d, i) => (
            <span key={i} className="truncate">
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
