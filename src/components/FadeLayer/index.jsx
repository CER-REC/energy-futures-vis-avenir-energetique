import React from 'react';
import { SOURCE_PATTERNS } from '../../constants';

const fadeLayer = ({
  year,
  isTransparent = false, /* boolean */
  isTransportation, /* boolean */
}) => ({ areaGenerator, series, innerHeight, innerWidth }) => {
  if (!year) {
    return null; // no valid year definition; do nothing
  }

  /**
   * Determine where the forecast bar should start.
   */
  const preForecastPercentage = ((year.forecastStart - year.min) / (year.max - year.min)) * 100;

  /**
   * Constant properties for pattern filter generation.
   */
  const filterProps = {
    x: 0,
    y: 0,
    height: innerHeight || '100%',
    width: innerWidth || '100%',
  };

  /**
   * Generate the areas for lines in the chart and apply a linear gradient to the fill.
   * The slice and reverse part is taken directly from the way Nivo draws the areas,
   * removing them affects the look of the chart, though I dont know why.
   */
  const areas = [...series]
    .reverse()
    .map((line) => {
      const id = `line-${line.id.replace(/ /g, '-')}`;
      const pattern = isTransportation && SOURCE_PATTERNS[line.id];
      return (
        <g key={id}>
          <defs>
            {/* background gradient with color */}
            {/* semi-transparent for scenarios viz and solid colors for by-sector viz */}
            {isTransparent ? (
              <linearGradient id={`${id}-gradient`}>
                <stop offset="0%" stopColor={line.color} stopOpacity="1" />
                <stop offset={`${preForecastPercentage}%`} stopColor={line.color} stopOpacity="1" />
                <stop offset="100%" stopColor={line.color} stopOpacity='0.05' />
              </linearGradient>
            ) : (
              <linearGradient id={`${id}-gradient`}>
                <stop offset="0%" stopColor={line.color} stopOpacity="1" />
                <stop offset={`${preForecastPercentage}%`} stopColor={line.color} stopOpacity="1" />
                <stop offset="100%" stopColor="#FFF" stopOpacity='1' />
              </linearGradient>
            )}

            {/* if a pattern is applicable, then combine it with the background */}
            {/* NOTE: masking cannot be used here because it exposes the color behind */}
            {pattern && (
              <>
                <rect id={`${id}-gradient-rect-bg`} {...filterProps} fill={`url(#${id}-gradient)`} />
                <rect id={`${id}-gradient-rect-pattern`} {...filterProps} fill={`url(#${pattern})`} />
                <filter id={`${id}-filter`}>
                  <feImage xlinkHref={`#${id}-gradient-rect-bg`} result={`#${id}-gradient-bg`} {...filterProps} />
                  <feImage xlinkHref={`#${id}-gradient-rect-pattern`} result={`#${id}-gradient-pattern`} {...filterProps} />
                  <feBlend in={`#${id}-gradient-bg`} in2={`#${id}-gradient-pattern`} mode="screen" result={`#${id}-gradient-blend`} />
                  <feComposite in={`#${id}-gradient-blend`} in2="SourceGraphic" operator="in" />
                </filter>
              </>
            )}
          </defs>
          <path
            d={areaGenerator(line.data.map(d => d.position))}
            fill={pattern ? undefined : `url(#${id}-gradient)`}
            filter={pattern ? `url(#${id}-filter)` : undefined}
            style={{ mixBlendMode: 'normal', pointerEvents: 'none' }}
          />
        </g>
      );
    });

  return <g opacity={0.7}>{areas}</g>;
};

export const fadeLayerBySector = props => fadeLayer(props /* { year, isTransportation } */);

export const fadeLayerScenario = ({ year }) => fadeLayer({ year, isTransparent: true });
