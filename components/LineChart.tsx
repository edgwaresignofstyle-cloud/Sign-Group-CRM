import React, { useState } from 'react';
import { ChartDataPoint } from '../types';

interface LineChartProps {
  data: ChartDataPoint[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: ChartDataPoint } | null>(null);

  const width = 800;
  const height = 320;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };

  const usableWidth = width - padding.left - padding.right;
  const usableHeight = height - padding.top - padding.bottom;

  const values = data.map(d => d.value);
  const maxValue = Math.max(...values, 0);
  const minValue = Math.min(...values, 0);

  const yScale = (value: number) => {
    const range = maxValue - minValue;
    if (range === 0) return usableHeight / 2 + padding.top;
    return usableHeight - ((value - minValue) / range) * usableHeight + padding.top;
  };

  const xScale = (index: number) => {
    return (index / (data.length - 1)) * usableWidth + padding.left;
  };

  const linePath = data
    .map((point, i) => {
      const x = xScale(i);
      const y = yScale(point.value);
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');

  const zeroLineY = yScale(0);

  return (
    <div className="relative w-full h-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Y-Axis Grid Lines and Labels */}
        {[...Array(5)].map((_, i) => {
          const value = minValue + (i / 4) * (maxValue - minValue);
          const y = yScale(value);
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e5e7eb" strokeWidth="1" />
              <text x={padding.left - 10} y={y + 4} textAnchor="end" fill="#6b7280" fontSize="12">
                {formatCurrency(value)}
              </text>
            </g>
          );
        })}
        
        {/* Zero Line */}
        <line x1={padding.left} y1={zeroLineY} x2={width - padding.right} y2={zeroLineY} stroke="#4f46e5" strokeWidth="1" strokeDasharray="4 4" />

        {/* X-Axis Labels */}
        {data.map((point, i) => (
          <text key={i} x={xScale(i)} y={height - padding.bottom + 20} textAnchor="middle" fill="#6b7280" fontSize="12">
            {point.label}
          </text>
        ))}

        {/* Data Line */}
        <path d={linePath} fill="none" stroke="#4f46e5" strokeWidth="2" />

        {/* Data Points and Tooltip Triggers */}
        {data.map((point, i) => {
          const cx = xScale(i);
          const cy = yScale(point.value);
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="8"
              fill="transparent"
              onMouseEnter={() => setTooltip({ x: cx, y: cy, data: point })}
              onMouseLeave={() => setTooltip(null)}
            />
          );
        })}

         {/* Highlighted point for tooltip */}
         {tooltip && (
             <circle cx={tooltip.x} cy={tooltip.y} r="5" fill="#4f46e5" stroke="#fff" strokeWidth="2" />
         )}

      </svg>
      {tooltip && (
        <div
          className="absolute p-2 text-sm text-white bg-gray-800 rounded-md shadow-lg pointer-events-none"
          style={{
            left: `${(tooltip.x / width) * 100}%`,
            top: `${(tooltip.y / height) * 100}%`,
            transform: 'translate(-50%, -120%)',
          }}
        >
          <div className="font-bold">{tooltip.data.label}</div>
          <div className={tooltip.data.value >= 0 ? 'text-green-400' : 'text-red-400'}>
            {formatCurrency(tooltip.data.value)}
          </div>
        </div>
      )}
    </div>
  );
};

export default LineChart;
