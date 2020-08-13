import { useContext, useMemo, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { ConfigContext } from '../utilities/configContext';
import convertUnit from '../utilities/convertUnit';

const ENERGY_DEMAND = gql`
  query ($iteration: ID!, $regions: [Region!], $scenarios: [String!]) {
    energyDemands(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sources: [ALL], sectors: ["total end-use"]) {
      province: region
      year
      value: quantity
    }
  }
`;
const GAS_PRODUCTIONS = gql`
query ($iteration: ID!, $regions: [Region!], $scenarios: [String!]) {
  gasProductions(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sources: [ALL] ){
      province: region
      year
      value: quantity
    }
  }
`;

const ELECTRICITY_GENERATIONS = gql`
query ($iteration: ID!, $regions: [Region!], $scenarios: [String!]) {
  electricityGenerations(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sources: [ALL]) {
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

const getQueryVariables = (config) => {
  let query;
  let queryVariables;
  if ((config.page === 'by-region') && (config.provinces.length)) {
    if (config.mainSelection === 'energyDemand') {
      query = ENERGY_DEMAND;
      queryVariables = {
        scenarios: config.scenario,
        iteration: yearToIteration[config.year],
        regions: config.provinces,
      };
    }
    if (config.mainSelection === 'gasProduction') {
      query = GAS_PRODUCTIONS;
      queryVariables = {
        scenarios: config.scenario,
        iteration: yearToIteration[config.year],
        regions: config.provinces,
      };
    }
    if (config.mainSelection === 'electricityGeneration') {
      query = ELECTRICITY_GENERATIONS;
      queryVariables = {
        scenarios: config.scenario,
        iteration: yearToIteration[config.year],
        regions: config.provinces,
      };
    }
  }
  return { query, queryVariables };
};

// Setup query + query variables
const getDefaultUnit = (config) => {
  let defaultUnit;
  switch (config.mainSelection) {
    case 'gasProduction':
      defaultUnit = 'millionCubicMetres';
      break;

    case 'electricityGeneration':
      defaultUnit = 'gigawattHours';
      break;

    default:
      defaultUnit = 'petajoules';
      break;
  }
  return defaultUnit;
};

// const DEFAULT_RETURN = {
//   loading: undefined,
//   error: undefined,
//   data: undefined,
// };

export default function () {
  const { config } = useContext(ConfigContext);
  const { query, queryVariables } = getQueryVariables(config);
  const { loading, error, data } = useQuery(query, { variables: queryVariables });
  const defaultUnit = getDefaultUnit(config);

  const configFilter = useCallback(
    row => config.provinces.indexOf(row.province) > -1
      && (!row.scenario || row.scenario.toLowerCase() === config.scenario),
    [config],
  );

  const processedData = useMemo(() => {
    if (loading) {
      return data;
    }

    const filteredData = (energyData) => {
      const byYear = energyData
        .filter(configFilter)
        .reduce((accu, curr) => {
          !accu[curr.year] && (accu[curr.year] = {});
          !accu[curr.year][curr.province] && (accu[curr.year][curr.province] = 0);
          accu[curr.year][curr.province] += (curr.value * convertUnit(defaultUnit, config.unit));
          return accu;
        }, {});
      return Object.keys(byYear).map(year => ({ year, ...byYear[year] }));
    };

    return {
      energyData: filteredData(data[`${config.mainSelection}s`]),
    };
  }, [config.mainSelection, config.unit, configFilter, data, defaultUnit, loading]);

  return { loading, error, processedData };
}
