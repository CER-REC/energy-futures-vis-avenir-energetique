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
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format(value) {
          const formatedVal = value + 5;
          return formatedVal < 10 ? `0${formatedVal}` : formatedVal;
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
