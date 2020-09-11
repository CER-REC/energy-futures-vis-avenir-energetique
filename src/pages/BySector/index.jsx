import React, { useMemo } from 'react';
import { ResponsiveStream } from '@nivo/stream';
import PropTypes from 'prop-types';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';

const BySector = ({ data, year }) => {
  const { sources: { energy: { colors } } } = useAPI();
  const { config } = useConfig();
  const keys = useMemo(() => {
    const sources = new Set((data || []).map(entry => Object.keys(entry)).flat());
    return [...config.sourceOrder].reverse().filter(s => sources.has(s));
  }, [data, config.sourceOrder]);

  if (!data || !year) {
    return null;
  }

  return (
    <ResponsiveStream
      data={data}
      keys={keys}
      margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
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
        format: value => ((value % 5) ? '' : value + year.min),
      }}
      axisLeft={null}
      curve="linear"
      offsetType="diverging"
      colors={d => colors[keys[d.index]]}
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
  year: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number }),
};

BySector.defaultProps = {
  data: undefined,
  year: { min: 0, max: 0 },
};

export default BySector;
