import React from 'react';

const STYLE = {
  fontSize: 13,
  textTransform: 'uppercase',
  fontFamily: '"FiraSansCondensed", "Roboto", "Helvetica", "Arial", sans-serif',
};

export default ({ year, label }) => (props) => {
  if (!year) {
    return null; // no valid year definition; do nothing
  }

  const forecastPercentage = (year.forecastStart - year.min) / (year.max - year.min);
  const height = props.innerHeight || props.height;
  const width = props.innerWidth || (props.width - 30);
  const x = forecastPercentage * width + (props.innerWidth ? 0 : 15);
  const y = props.margin?.top || 50;
  return (
    <g>
      <defs>
        <linearGradient id="forecastBarGradient">
          <stop offset="0%" stopColor="#EEE" stopOpacity="1" />
          <stop offset="30%" stopColor="#EEE" stopOpacity="1" />
          <stop offset="100%" stopColor="#EEE" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect
        x={x}
        y={-y}
        height={20}
        width={width - x}
        fill="url(#forecastBarGradient)"
      />
      <text x={x + 5} y={-y + 14} fill="#5D5D5D" style={STYLE}>
        {label || 'forecast'}
      </text>
      <path
        d={`M${x} ${-y} l0 ${height + y}`}
        strokeDasharray="5,5"
        stroke="#444"
        strokeWidth="1"
      />
    </g>
  );
};
