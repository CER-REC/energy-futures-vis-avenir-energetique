import React from 'react';
import { SOURCE_PATTERNS } from '../../constants';

const fadeLayer = ({
  year,
  isTransparent = false, /* boolean */
  isTransportation, /* boolean */
}) => ({ areaGenerator, series }) => {
  if (!year) {
    return null; // no valid year definition; do nothing
  }

  /**
   * Determine where the forecast bar should start.
   */
  const preForecastPercentage = ((year.forecastStart - year.min) / (year.max - year.min)) * 100;

  /**
   * Generate the areas for lines in the chart and apply a linear gradient to the fill.
   * The slice and reverse part is taken directly from the way Nivo draws the areas,
   * removing them affects the look of the chart, though I dont know why.
   */
  const areas = [...series]
    .reverse()
    .map((line) => {
      const id = `line-${line.id.replace(/ /g, '-')}`;
      const props = {
        d: areaGenerator(line.data.map(d => d.position)),
        style: { mixBlendMode: 'normal', pointerEvents: 'none' },
      };
      return (
        <g key={id}>
          <defs>
            {/* background gradient with color */}
            {/* semi-transparent for scenarios viz and solid colors for by-sector viz */}
            <linearGradient id={`${id}-gradient`}>
              <stop offset="0%" stopColor={line.color} stopOpacity={isTransparent ? 0.5 : 1} />
              <stop offset={`${preForecastPercentage}%`} stopColor={line.color} stopOpacity={isTransparent ? 0.5 : 1} />
              <stop offset="100%" stopColor="#FFF" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* a white background for pattern masking */}
          {!isTransparent && <path {...props} fill="#FFF" />}

          {/* apply the masking if it is a pattern, otherwise only render the colored gradient */}
          <path
            {...props}
            fill={`url(#${id}-gradient)`}
            mask={isTransportation && SOURCE_PATTERNS[line.id] ? `url(#${line.id}-mask)` : undefined}
          />
        </g>
      );
    });

  return <g opacity={0.7}>{areas}</g>;
};

export const fadeLayerBySector = props => fadeLayer(props /* { year, isTransportation } */);

export const fadeLayerScenario = ({ year }) => fadeLayer({ year, isTransparent: true });
