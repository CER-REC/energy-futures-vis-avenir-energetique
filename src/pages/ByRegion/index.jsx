import React, { useContext, useMemo, useCallback } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';

import { ConfigContext } from '../../utilities/configContext';
// import { CONFIG_REPRESENTATION } from '../../types';

const ByRegion = () => {
  const { config } = useContext(ConfigContext);
  const { loading, error, processedData } = useEnergyFutureData();

  return (
    <ResponsiveBar
      data={processedData?.energyData || []}
      keys={config.provinces}
      indexBy="year"
      margin={{ top: 50, right: 0, bottom: 50, left: 80 }}
      padding={0.1}
      colors={{ scheme: 'nivo' }}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
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
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      animate
      motionStiffness={90}
      motionDamping={15}
    />
  );
};

export default ByRegion;
