import React from 'react';

/**
 * Reusable Animated Loader Component
 * Theme-matching organic farm green colors (#15803d, #22c55e)
 * Supports fullScreen mode and inline spinner mode
 */
const Loader = ({
  fullScreen = false,
  text = 'Loading fresh organic products...',
  size = 'md', // 'sm', 'md', 'lg'
  className = ''
}) => {
  const sizeMap = {
    sm: { width: 28, height: 28 },
    md: { width: 48, height: 48 },
    lg: { width: 72, height: 72 }
  };

  const { width, height } = sizeMap[size] || sizeMap.md;

  const spinnerSvg = (
    <div className="jsr-loader-spinner-wrapper">
      <svg
        width={width}
        height={height}
        viewBox="0 0 50 50"
        className="jsr-animated-svg"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#dcfce7"
          strokeWidth="4"
        />
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="url(#jsr-green-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="90, 150"
          strokeDashoffset="0"
          className="jsr-spinner-circle"
        />
        <defs>
          <linearGradient id="jsr-green-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
        </defs>
      </svg>
      {/* Centered organic seedling icon */}
      <span className="jsr-loader-leaf-icon" aria-hidden="true">🌱</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`jsr-loader-fullscreen ${className}`}>
        <div className="jsr-loader-card">
          {spinnerSvg}
          <div className="jsr-loader-branding">
            <span className="jsr-loader-brand-title">JSR Fruit & Vegetable</span>
            <p className="jsr-loader-text">{text}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`jsr-loader-inline ${className}`}>
      {spinnerSvg}
      {text && <p className="jsr-loader-inline-text">{text}</p>}
    </div>
  );
};

export default Loader;
