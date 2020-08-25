import { useContext, useMemo, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import convertUnit from '../utilities/convertUnit';
import useAPI from './useAPI';
import useConfig from './useConfig';

// Some parts of this file are not very DRY in anticipation of changes
// to the individual queries
const ENERGY_DEMAND = gql`
  query ($iteration: ID!, $regions: [Region!], $scenarios: [String!]) {
    resources:energyDemands(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sources: [ALL], sectors: ["total end-use"]) {
      province: region
      year
      value: quantity
    }
  }
`;
const GAS_PRODUCTIONS = gql`
query ($iteration: ID!, $regions: [Region!], $scenarios: [String!]) {
  resources:gasProductions(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sources: [ALL] ){
      province: region
      year
      value: quantity
    }
  }
`;

const ELECTRICITY_GENERATIONS = gql`
query ($iteration: ID!, $regions: [Region!], $scenarios: [String!]) {
  resources:electricityGenerations(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sources: [ALL]) {
    province: region
    year
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

const getQuery = (config) => {
  // TODO: Revisit this config.provinces check
  if ((config.page === 'by-region') && (config.provinces)) {
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
  const { data: { yearIdIterations } } = useAPI();
  const { config } = useConfig();
  const query = getQuery(config);
  const defaultUnit = getDefaultUnit(config);

  if (!query) {
    return {
      loading: false,
      error: null,
      data: [],
    };
  }

  const { loading, error, data } = useQuery(query, {
    variables: {
      scenarios: config.scenarios,
      iteration: yearIdIterations[config.yearId].id,
      regions: config.provinces,
    },
  });

  /*
  TODO: Revisit this logic.
  This filter doesn't do anything in most cases, since the data
  already comes back filtered, but it does do one thing in the
  case where no regions is selected in the by regions chart,
  since it's currently calling the API with [] as the region filter,
  which would return all regions, this filter will empty the list in that case
  */
  const configFilter = useCallback(
    row => config.provinces.indexOf(row.province) > -1
      && (!row.scenario || row.scenarios === config.scenarios),
    [config.provinces, config.scenarios],
  );

  const processedData = useMemo(() => {
    if (!data) {
      return data;
    }

    const filteredData = (energyData) => {
      const byYear = energyData
        .filter(configFilter)
        .reduce((accu, curr) => {
          const result = { ...accu };
          if (!result[curr.year]) {
            result[curr.year] = {};
          }
          if (!result[curr.year][curr.province]) {
            result[curr.year][curr.province] = 0;
          }
          result[curr.year][curr.province] += (curr.value * convertUnit(defaultUnit, config.unit));
          return result;
        }, {});
      return Object.keys(byYear).map(year => ({ year, ...byYear[year] }));
    };

    return filteredData(data.resources);
  }, [config.unit, configFilter, data, defaultUnit]);

  return { loading, error, data: processedData };
};
