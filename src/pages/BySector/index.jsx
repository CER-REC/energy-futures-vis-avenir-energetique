import React, { useMemo } from 'react';
import { ResponsiveStream } from '@nivo/stream';
import PropTypes from 'prop-types';

import { SOURCE_NAME, SOURCE_COLOR } from '../../constants';
import useConfig from '../../hooks/useConfig';

const BySector = ({ data }) => {
  const { config } = useConfig();

  if (!data) {
    return null;
  }

  const keys = useMemo(() => {
    const sources = new Set(data.map(entry => Object.keys(entry)).flat());
    return [...config.sourceOrder].reverse().map(s => SOURCE_NAME[s]).filter(s => sources.has(s));
  }, [data, config.sourceOrder]);

  return (
    <ResponsiveStream
      data={data}
      keys={keys}
      margin={{ top: 50, right: 50, bottom: 50, left: 80 }}
      axisTop={null}
      axisRight={{
        orient: 'right',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        tickValues: [0, 5, 10, 15, 20, 25, 30, 35],
        format: value => value + 2005,
      }}
      axisLeft={null}
      curve="linear"
      offsetType="diverging"
      colors={d => SOURCE_COLOR[keys[d.index]]}
      fillOpacity={0.60}
      borderColor={{ theme: 'background' }}
      dotSize={8}
      dotColor={{ from: 'color' }}
      dotBorderWidth={2}
      dotBorderColor={{ from: 'color', modifiers: [['darker', 0.7]] }}
      animate
      motionStiffness={90}
      motionDamping={15}
    />
  );
};

BySector.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
};

BySector.defaultProps = {
  data: undefined,
};

export default BySector;
