import React, { useContext, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';
import { ConfigContext } from '../../utilities/configContext';
import { REGION_ORDER } from '../../types';

const ByRegion = () => {
  const { config, setConfig } = useContext(ConfigContext);
  const { loading, error, data } = useEnergyFutureData();

  /**
   * A "hacky" but sufficient way to reselect all regions after
   * being redirected from other pages but none of the regions is currently selected.
   */
  useEffect(() => {
    if (config.page === 'by-region' && JSON.stringify(config.provinces || []) === '["ALL"]') {
      setConfig({ ...config, provinces: REGION_ORDER });
    }
  }, [config]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ResponsiveBar
      data={(loading || error) ? [] : data.energyData}
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
