import React, { useContext, useMemo, useCallback } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { data as dataEnergyDemand } from './dataEnergyDemand';
import { data as dataElectricityGeneration } from './dataElectricityGeneration';
import { data as dataOilProduction } from './dataOilProduction';
import { data as dataGasProduction } from './dataGasProduction';

import { ConfigContext } from '../../containers/App/lazy';
import { CONFIG_REPRESENTATION } from '../../types';
import PageLayout from '../../components/PageLayout';


const RESOURCES = gql`
  query {
    energyDemands {
      region
      value: quantity
      year
    }
  }
`;

const ByRegion = () => {
  const { config } = useContext(ConfigContext);

  //const { loading, error, data: response } = useQuery(RESOURCES);
  //console.log('GraphQL example:', loading, error, response);

  const data = useMemo(() => {
    switch (config.mainSelection) {
      case 'energyDemand': return dataEnergyDemand;
      case 'electricityGeneration': return dataElectricityGeneration;
      case 'oilProduction': return dataOilProduction;
      case 'gasProduction': default: return dataGasProduction;
    }
  }, [config.mainSelection]);

  const configFilter = useCallback(
    row => config.provinces.indexOf(row.province) > -1 &&
      (!row.unit || row.unit.toLowerCase() === CONFIG_REPRESENTATION[config.unit].toLowerCase()) &&
      (!row.scenario || row.scenario === config.scenario),
    [config],
  );

  const processedData = useMemo(() => {
    const byYear = data
      .filter(configFilter)
      .reduce((accu, curr) => {
        !accu[curr.year] && (accu[curr.year] = {});
        !accu[curr.year][curr.province] && (accu[curr.year][curr.province] = 0);
        accu[curr.year][curr.province] += curr.value;
        return accu;
      }, {});
    return Object.keys(byYear).map(year => ({ year, ...byYear[year] }));
  }, [data, configFilter]);

  return (
    <PageLayout showRegion>
      <ResponsiveBar
        data={processedData || []}
        keys={config.provinces}
        indexBy="year"
        margin={{ top: 50, right: 0, bottom: 50, left: 80 }}
        padding={0.1}
        colors={{ scheme: 'nivo' }}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: 32,
          format: year => (year % 5) ? '' : year,
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
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </PageLayout>
  );
};

export default ByRegion;
