import React from 'react';
import PropTypes from 'prop-types';
import { SOURCE_PATTERNS } from '../../constants';

const FillLayer = isTransportation => ({ areaGenerator, series }) => {
  /**
   * Generate the areas for lines in the chart and apply a solid fill.
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
          {/* a white background for pattern masking */}
          <path {...props} fill="#FFF" />

          {/* apply the masking if it is a pattern, otherwise only render the colored gradient */}
          <path
            {...props}
            fill={line.color}
            fillOpacity={1}
            mask={isTransportation && SOURCE_PATTERNS[line.id] ? `url(#${line.id}-mask)` : undefined}
          />
        </g>
      );
    });

  return <g opacity={0.7}>{areas}</g>;
};

FillLayer.propTypes = {
  isTransportation: PropTypes.bool,
};

FillLayer.defaultProps = {
  isTransportation: false,
};

export default FillLayer;
