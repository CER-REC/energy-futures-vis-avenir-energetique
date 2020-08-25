import React from 'react';
import { ResponsiveStream } from '@nivo/stream';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';

const BySector = () => {
  const { data } = useEnergyFutureData();
  if (!data) {
    return null;
  }

  return (
    <ResponsiveStream
      data={data}
      keys={Object.keys(data[0])}
      margin={{
        top: 50,
        right: 50,
        bottom: 50,
        left: 80,
      }}
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
        format(value) {
          return value + 2005;
        },
      }}
      axisLeft={null}
      curve="linear"
      offsetType="diverging"
      colors={{ scheme: 'nivo' }}
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

export default BySector;
