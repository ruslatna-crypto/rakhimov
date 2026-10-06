import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/dryingChart.css';

const PRODUCTS = [
  { key: 'onion', value: 4.12 },
  { key: 'eryngium', value: 3.03 },
  { key: 'dill', value: 5.09 },
  { key: 'bellPepper', value: 6.06 },
  { key: 'tomatoes', value: 6.20 },
  { key: 'potatoes', value: 5.00 },
  { key: 'carrots', value: 6.20 },
  { key: 'pineapple', value: 6.03 },
];

export default function DryingChart() {
  const { t, lang } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // SVG dimensions
  const svgWidth = 860;
  const svgHeight = 420;
  const paddingLeft = 75;
  const paddingRight = 30;
  const paddingTop = 45;
  const paddingBottom = 75;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxY = 7; // Max scale for hours (values are between 3.03 and 6.20)
  const yTicks = [0, 1, 2, 3, 4, 5, 6, 7];

  const slotWidth = chartWidth / PRODUCTS.length;
  const barWidth = 52;

  return (
    <section className="drying-chart-card" aria-label={t('dryingChart.title')}>
      <div className="drying-chart-header">
        <h3 className="drying-chart-title">{t('dryingChart.title')}</h3>
      </div>

      <div className="drying-chart-svg-wrapper">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="drying-chart-svg"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={t('dryingChart.title')}
        >
          <defs>
            {/* Standard Bar Gradient */}
            <linearGradient id="dryingBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            {/* Hovered Bar Gradient */}
            <linearGradient id="dryingBarHoverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Soft Shadow for Bars */}
            <filter id="barShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.12" />
            </filter>

            {/* Tooltip Glow */}
            <filter id="tooltipGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Ticks */}
          {yTicks.map((tick) => {
            const yPos = paddingTop + chartHeight - (tick / maxY) * chartHeight;
            return (
              <g key={tick} className="chart-grid-line">
                <line
                  x1={paddingLeft}
                  y1={yPos}
                  x2={paddingLeft + chartWidth}
                  y2={yPos}
                  stroke={tick === 0 ? '#64748b' : '#e2e8f0'}
                  strokeWidth={tick === 0 ? '1.5' : '1'}
                  strokeDasharray={tick === 0 ? 'none' : '4 4'}
                />
                <text
                  x={paddingLeft - 12}
                  y={yPos + 4}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="12"
                  fontWeight="500"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Y-Axis Label (Rotated) */}
          <text
            transform={`rotate(-90)`}
            x={-(paddingTop + chartHeight / 2)}
            y={24}
            textAnchor="middle"
            fill="#475569"
            fontSize="13"
            fontWeight="600"
            letterSpacing="0.02em"
          >
            {t('dryingChart.yAxis')}
          </text>

          {/* Bars & Labels */}
          {PRODUCTS.map((prod, index) => {
            const barHeight = (prod.value / maxY) * chartHeight;
            const barCenterX = paddingLeft + index * slotWidth + slotWidth / 2;
            const barX = barCenterX - barWidth / 2;
            const barY = paddingTop + chartHeight - barHeight;
            const isHovered = hoveredIndex === index;

            const localizedProductName = t(`dryingChart.products.${prod.key}`);

            return (
              <g
                key={prod.key}
                className={`chart-bar-group ${isHovered ? 'is-active' : ''}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                tabIndex="0"
                role="graphics-symbol"
                aria-label={`${localizedProductName}: ${prod.value.toFixed(2)} ${t('dryingChart.hour')}`}
                style={{ outline: 'none' }}
              >
                {/* Invisible wider hit area for easy hover on mobile/desktop */}
                <rect
                  x={paddingLeft + index * slotWidth}
                  y={paddingTop}
                  width={slotWidth}
                  height={chartHeight + 40}
                  fill="transparent"
                  cursor="pointer"
                />

                {/* Visible Animated Bar */}
                <rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  rx="6"
                  ry="6"
                  fill={isHovered ? 'url(#dryingBarHoverGrad)' : 'url(#dryingBarGrad)'}
                  filter="url(#barShadow)"
                  className="chart-bar-rect"
                />

                {/* Numerical Value Label on top of each bar */}
                <text
                  x={barCenterX}
                  y={barY - 8}
                  textAnchor="middle"
                  fill={isHovered ? '#0284c7' : '#1e293b'}
                  fontSize="12.5"
                  fontWeight="700"
                  style={{ pointerEvents: 'none', transition: 'fill 0.2s ease' }}
                >
                  {prod.value.toFixed(2)}
                </text>

                {/* X-Axis Product Name below bar */}
                <text
                  x={barCenterX}
                  y={paddingTop + chartHeight + 24}
                  textAnchor="middle"
                  fill={isHovered ? '#0284c7' : '#334155'}
                  fontSize="12.5"
                  fontWeight={isHovered ? '700' : '600'}
                  style={{ pointerEvents: 'none', transition: 'fill 0.2s ease, font-weight 0.2s ease' }}
                >
                  {localizedProductName}
                </text>
              </g>
            );
          })}

          {/* Interactive Floating Tooltip */}
          {hoveredIndex !== null && (() => {
            const activeProd = PRODUCTS[hoveredIndex];
            const activeHeight = (activeProd.value / maxY) * chartHeight;
            const activeCenterX = paddingLeft + hoveredIndex * slotWidth + slotWidth / 2;
            const activeBarY = paddingTop + chartHeight - activeHeight;

            const tooltipWidth = 160;
            const tooltipHeight = 52;
            // Bound tooltip X so it stays within SVG boundaries
            const clampedX = Math.max(
              paddingLeft + tooltipWidth / 2,
              Math.min(svgWidth - paddingRight - tooltipWidth / 2, activeCenterX)
            );
            const tooltipY = activeBarY - tooltipHeight - 14;

            const prodName = t(`dryingChart.products.${activeProd.key}`);
            const timeText = `${t('dryingChart.dryingTime')}: ${activeProd.value.toFixed(2)} ${t('dryingChart.hour')}`;

            return (
              <g
                className="chart-tooltip-box"
                transform={`translate(${clampedX}, ${tooltipY})`}
                style={{ pointerEvents: 'none' }}
              >
                {/* Tooltip Background Bubble */}
                <rect
                  x={-tooltipWidth / 2}
                  y={0}
                  width={tooltipWidth}
                  height={tooltipHeight}
                  rx="8"
                  ry="8"
                  className="chart-tooltip-bg"
                  filter="url(#tooltipGlow)"
                />

                {/* Tooltip Arrow Pointer */}
                <polygon
                  points={`0,${tooltipHeight + 6} -6,${tooltipHeight} 6,${tooltipHeight}`}
                  fill="#0f172a"
                />

                {/* Line 1: Product Name */}
                <text
                  x={0}
                  y={20}
                  textAnchor="middle"
                  className="chart-tooltip-title"
                >
                  {prodName}
                </text>

                {/* Line 2: Drying time label + value + unit */}
                <text
                  x={0}
                  y={38}
                  textAnchor="middle"
                  className="chart-tooltip-value"
                >
                  {timeText}
                </text>
              </g>
            );
          })()}
        </svg>
      </div>
    </section>
  );
}
