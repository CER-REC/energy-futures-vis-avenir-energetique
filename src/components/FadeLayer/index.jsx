import React from 'react';

export default ({ year, isTransportation }) => ({ areaGenerator, series }) => {
  const preForecastPercentage = ((year.forecastStart - year.min) / (year.max - year.min)) * 100;
  const getPattern = (id) => {
    switch (id) {
      case 'AVIATION': return isTransportation ? 'squares' : 'line-OIL-gradient';
      case 'DIESEL': return 'lines-horizontal';
      case 'GASOLINE': return 'lines-vertical';
      case 'OIL': return 'dots';
      default: return `line-${id.replace(/ /g, '-')}-gradient`;
    }
  };

  if (!year) {
    return null; // no valid year definition; do nothing
  }

  /**
   * Generate the areas for lines in the chart and apply a linear gradient to the fill.
   * The slice and reverse part is taken directly from the way Nivo draws the areas,
   * removing them affects the look of the chart, though I dont know why.
   */
  const areas = [...series]
    .reverse()
    .map(line => (
      <g key={`line-${line.id}-gradient`}>
        <defs>
          <linearGradient id={`line-${line.id.replace(/ /g, '-')}-gradient`}>
            {/* Gradient starts to fade after forecast line */}
            <stop offset="0%" stopColor={line.color} stopOpacity="1" />
            <stop offset={`${preForecastPercentage}%`} stopColor={line.color} stopOpacity="1" />
            <stop offset="100%" stopColor={line.color} stopOpacity='0.25' />
          </linearGradient>
        </defs>
        <path
          d={areaGenerator(line.data.map(d => d.position))}
          fill={`url(#${getPattern(line.id)})`}
          style={{ mixBlendMode: 'normal', pointerEvents: 'none' }}
        />
      </g>
    ));

  return <g opacity={0.8}>{areas}</g>;
};
