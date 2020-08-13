import React, { useContext, useEffect, useMemo, useCallback } from 'react';
import { ResponsiveBar } from '@nivo/bar';

// TODO: remove the following references once the data hook is ready
import { data as dataEnergyDemand } from './dataEnergyDemand';
import { data as dataElectricityGeneration } from './dataElectricityGeneration';
import { data as dataOilProduction } from './dataOilProduction';
import { data as dataGasProduction } from './dataGasProduction';

import { ConfigContext } from '../../utilities/configContext';
import { CONFIG_REPRESENTATION, REGION_ORDER } from '../../types';

const ByRegion = () => {
  const { config, setConfig } = useContext(ConfigContext);

  /**
   * A "hacky" but sufficient way to reselect all regions after
   * being redirected from other pages but none of the regions is currently selected.
   */
  useEffect(() => {
    if (config.page === 'by-region' && JSON.stringify(config.provinces || []) === '["ALL"]') {
      setConfig({ ...config, provinces: REGION_ORDER });
    }
  }, [config]); // eslint-disable-line react-hooks/exhaustive-deps

  // TODO: remove this after the data hook is ready
  const data = useMemo(() => {
    switch (config.mainSelection) {
      case 'energyDemand': return dataEnergyDemand;
      case 'electricityGeneration': return dataElectricityGeneration;
      case 'oilProduction': return dataOilProduction;
      case 'gasProduction': default: return dataGasProduction;
    }
  }, [config.mainSelection]);

  // TODO: remove this after the data hook is ready
  const configFilter = useCallback(
    row => config.provinces.indexOf(row.province) > -1
      && (!row.unit || row.unit.toLowerCase() === CONFIG_REPRESENTATION[config.unit].toLowerCase())
      && (!row.scenario || row.scenario === config.scenario),
    [config],
  );

  // TODO: remove this after the data hook is ready
  const processedData = useMemo(() => {
    const byYear = data
      .filter(configFilter)
      .reduce((accu, curr) => {
        const result = { ...accu };
        if (!result[curr.year]) {
          result[curr.year] = {};
        }
        if (!result[curr.year][curr.province]) {
          result[curr.year][curr.province] = 0;
        }
        result[curr.year][curr.province] += curr.value;
        return result;
      }, {});
    return Object.keys(byYear).map(year => ({ year, ...byYear[year] }));
  }, [data, configFilter]);

  return (
    <ResponsiveBar
      data={processedData || []}
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
      // labelSkipWidth={12}
      // labelSkipHeight={12}
      // labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
      animate
      motionStiffness={90}
      motionDamping={15}
    />
  );
};

export default ByRegion;
