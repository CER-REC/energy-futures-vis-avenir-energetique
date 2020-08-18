import { useContext, useMemo, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { ConfigContext } from '../utilities/configContext';
import convertUnit from '../utilities/convertUnit';

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

const yearToIteration = {
  2016: 1,
  '2016*': 2,
  2017: 3,
  2018: 4,
  2019: 5,
};

// Setup query + query variables
const getQueryVariables = (config) => {
  // TODO: Revisit this config.provinces check
  if ((config.page === 'by-region') && (config.provinces)) {
    switch (config.mainSelection) {
      case 'oilProduction':
        return {
          query: OIL_PRODUCTIONS,
          queryVariables: {
            scenarios: config.scenario,
            iteration: yearToIteration[config.year],
            regions: config.provinces,
          },
        };
      case 'energyDemand':
        return {
          query: ENERGY_DEMAND,
          queryVariables: {
            scenarios: config.scenario,
            iteration: yearToIteration[config.year],
            regions: config.provinces,
          },
        };
      case 'gasProduction':
        return {
          query: GAS_PRODUCTIONS,
          queryVariables: {
            scenarios: config.scenario,
            iteration: yearToIteration[config.year],
            regions: config.provinces,
          },
        };
      case 'electricityGeneration':
        return {
          query: ELECTRICITY_GENERATIONS,
          queryVariables: {
            scenarios: config.scenario,
            iteration: yearToIteration[config.year],
            regions: config.provinces,
          },
        };
      default:
        break;
    }
  }
  return { query: undefined, queryVariables: undefined };
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

export default function () {
  const { config } = useContext(ConfigContext);
  const { query, queryVariables } = getQueryVariables(config);
  const defaultUnit = getDefaultUnit(config);
  const { loading, error, data } = useQuery(query, { variables: queryVariables });

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
      && (!row.scenario || row.scenario.toLowerCase() === config.scenario),
    [config.provinces, config.scenario],
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
}
