import React, { useMemo } from 'react';
import { Line } from '@nivo/line';
import PropTypes from 'prop-types';
import getYearX from '../../utilities/getYearX';

const NetBarLineLayer = ({
  bars,
  keys,
  data,
  height,
  width,
  maxValue,
  minValue,
  xScale,
}) => {
  const netPoints = useMemo(
    () => data.map(item => ({
      x: item.year,
      y: keys.reduce((total, key) => (item[key] || 0) + total, 0),
    })),
    [data, keys],
  );
  const barOffset = useMemo(
    () => {
      const years = data.map(item => item.year);

      return getYearX(Math.min(...years), xScale, bars);
    },
    [data, bars, xScale],
  );

  return (
    <g style={{ pointerEvents: 'none' }}>
      <Line
        renderWrapper={false}
        layers={['lines']}
        width={width}
        height={height}
        colors="black"
        data={[{
          id: 'NetBarLineLayer',
          data: netPoints,
        }]}
        margin={{
          left: barOffset,
          right: barOffset,
        }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: minValue,
          max: maxValue,
        }}
      />
    </g>
  );
};

NetBarLineLayer.propTypes = {
  bars: PropTypes.arrayOf(PropTypes.shape({
    data: PropTypes.shape({ indexValue: PropTypes.string.isRequired }),
    width: PropTypes.number.isRequired,
  })).isRequired,
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    year: PropTypes.string.isRequired,
  })).isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  // The net line may have different max and min values from the bar data
  // The min and max values must be set in the parent chart for the y-axes to line up
  maxValue: PropTypes.number.isRequired,
  minValue: PropTypes.number.isRequired,
  xScale: PropTypes.func.isRequired,
};

export default NetBarLineLayer;
