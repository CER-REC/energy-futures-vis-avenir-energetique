import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';

const SOURCES = ['electricity', 'oilProducts', 'bio', 'naturalGas', 'coal', 'solarWindGeothermal'];

const BySector = () => {
  const { loading, error, data } = useEnergyFutureData();
  if (!data) {
    return null;
  }

  return (
    <ResponsiveLine
      data={data || []}
      keys={SOURCES}
      margin={{ top: 50, right: 50, bottom: 50, left: 80 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', min: 0, max: 'auto', stacked: true, reverse: false }}
      colors={{ scheme: 'nivo' }}
      enablePoints={false}
      enableArea
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: 'middle',
        legendOffset: 32,
        format: year => ((year % 5) ? '' : year),
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: 'middle',
        legendOffset: -40,
      }}
      enableLabel={false}
      // labelSkipWidth={12}
      // labelSkipHeight={12}
      // labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
      animate
      motionStiffness={90}
      motionDamping={15}
      useMesh
    />
  );
};

export default BySector;
