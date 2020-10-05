import React from 'react';

export default ({ min: yearMin, max: yearMax, foreCastStart }) => ({ areaGenerator, series }) => {
  const preForecastPercentage = ((foreCastStart - yearMin) / (yearMax - yearMin)) * 100;

  /*
    Generate the areas for lines in the chart and apply a linear gradient to the fill.
    The slice and reverse part is taken directly from the way Nivo draws the areas,
    removing them affects the look of the chart, though I dont know why.
    */
  const areas = series
    .slice(0)
    .reverse()
    .map((line, index) => (
      <g key={line.id}>
        <defs>
          <linearGradient id={`line-${index}-gradient`}>
            {/* Gradient starts to fade after forecast line */}
            <stop offset={`${preForecastPercentage}%`} stopColor={line.color} stopOpacity='1' />
            <stop offset={`${100 - preForecastPercentage}%`} stopColor={line.color} stopOpacity='0.6' />
            <stop offset='95%' stopColor={line.color} stopOpacity='0.2' />
          </linearGradient>
        </defs>
        <path
          d={areaGenerator(line.data.map(d => d.position))}
          fill={`url(#line-${index}-gradient)`}
          style={{ mixBlendMode: 'normal', pointerEvents: 'none' }}
        />
      </g>
    ));

  return (<g opacity={0.7}>{areas}</g>);
};
