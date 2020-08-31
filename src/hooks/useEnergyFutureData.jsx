import { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import useAPI from './useAPI';
import useConfig from './useConfig';
import convertUnit from '../utilities/convertUnit';
import { REGION_ORDER } from '../types';
import { parseData, NOOP } from '../utilities/parseData';

// Some parts of this file are not very DRY in anticipation of changes
// to the individual queries
const ENERGY_DEMAND = gql`
  query ($iteration: ID!, $regions: [Region!], $scenarios: [String!]) {
    resources:energyDemands(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sources: [ALL], sectors: ["total end-use"]) {
      province: region
      year
      scenario
      value: quantity
    }
  }
`;
const GAS_PRODUCTIONS = gql`
query ($iteration: ID!, $regions: [Region!], $scenarios: [String!]) {
  resources:gasProductions(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sources: [ALL] ){
      province: region
      year
      scenario
      value: quantity
    }
  }
`;

const ELECTRICITY_GENERATIONS = gql`
query ($iteration: ID!, $regions: [Region!], $scenarios: [String!]) {
  resources:electricityGenerations(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sources: [ALL]) {
    province: region
    year
    scenario
    value: quantity
  }
}
`;
const OIL_PRODUCTIONS = gql`
query ($iteration: ID!, $regions: [Region!], $scenarios: [String!]) {
  resources:oilProductions(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios) {
    province: region
    year
    value: quantity
  }
}
`;

const BY_SECTOR = gql`
query ($iteration: ID!, $regions: [Region!], $scenarios: [String!], $sectors:[String!], $sources: [EnergySource!]) {
  resources:energyDemands(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sectors: $sectors, sources: $sources) {
    year
    value: quantity
    source
  }
}
`;

const ELECTRICITY_GENERATIONS_SOURCE = gql`
query ($iteration: ID!, $regions: [Region!], $scenarios: [String!]) {
  resources:electricityGenerations(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sources: []) {
    province: region
    year
    source
    value: quantity
  }
}
`;

const getQuery = (config) => {
  // TODO: Revisit this config.provinces check
  if (['by-region', 'scenarios'].includes(config.page) && config.provinces) {
    switch (config.mainSelection) {
      case 'oilProduction':
        return OIL_PRODUCTIONS;
      case 'energyDemand':
        return ENERGY_DEMAND;
      case 'gasProduction':
        return GAS_PRODUCTIONS;
      case 'electricityGeneration':
        return ELECTRICITY_GENERATIONS;
      default:
        break;
    }
  } else if (config.page === 'electricity') {
    return ELECTRICITY_GENERATIONS_SOURCE;
  } else if (config.page === 'by-sector' && config.provinces) {
    return BY_SECTOR;
  }

  return null;
};

// getDefaultUnit returns the default unit that the API returns.
const getDefaultUnit = (config) => {
  switch (config.mainSelection) {
    case 'gasProduction':
      return 'millionCubicMetres';

    case 'electricityGeneration':
      return 'gigawattHours';

    case 'oilProduction':
      return 'thousandCubicMetres';

    case 'energyDemand':
      return 'petajoules';

    default:
      return '';
  }
};

export default () => {
  const { yearIdIterations } = useAPI();
  const { config } = useConfig();
  let query = getQuery(config);
  const unitConversion = convertUnit(getDefaultUnit(config), config.unit);

  const regions = useMemo(() => {
    if (config.page === 'electricity' && config.provinces[0] === 'ALL') {
      return REGION_ORDER;
    }
    return config.provinces;
  }, [config.page, config.provinces]);

  // #region Enum Correction
  // TODO: fix the config data to match the enums then remove this next part
  // and replace correctedSources with config.sources
  const correctedSources = [...config.sources];

  if ((config.page === 'by-sector') && (config.provinces)) {
    if (correctedSources.find(item => item === 'solarWindGeothermal')) {
      correctedSources[correctedSources.indexOf('solarWindGeothermal')] = 'renewable';
    }
    if (correctedSources.find(item => item === 'oilProducts')) {
      correctedSources[correctedSources.indexOf('oilProducts')] = 'oil';
    }
    if (correctedSources.find(item => item === 'naturalGas')) {
      correctedSources[correctedSources.indexOf('naturalGas')] = 'gas';
    }
    // This one removes nuclear because it shouldnt even be a source option
    if (correctedSources.find(item => item === 'nuclear')) {
      correctedSources.splice(correctedSources.indexOf('nuclear'), 1);
    }
    if (!correctedSources.length) {
      query = null;
    }
  }
  // #endregion

  // A GraphQL document node is needed even if skipping is specified
  const { loading, error, data } = useQuery(query || gql`{ _ }`, {
    variables: {
      scenarios: config.scenarios,
      iteration: yearIdIterations[config.yearId]?.id || '',
      regions,
      // FIXME: config will store it as "total"
      // it should be "total end-use"
      sectors: config.sector === 'total' ? 'total end-use' : config.sector,
      sources: correctedSources,
    },
    skip: !query,
  });

  const processedData = useMemo(() => {
    if (!data || !data.resources) {
      return data;
    }
    return (parseData[config.page] || NOOP)(data.resources, unitConversion, regions);
  }, [config.page, data, regions, unitConversion]);

  return { loading, error, data: processedData };
};
