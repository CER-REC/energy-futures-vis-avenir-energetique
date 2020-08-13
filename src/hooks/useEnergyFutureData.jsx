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

// Setup query + query variables
// This function isn't very DRY because I am anticipating the
// queries to be different for each selection
const getQueryVariables = (config) => {
  if ((config.page === 'by-region') && (config.provinces.length)) {
    if (config.mainSelection === 'energyDemand') {
      return {
        query: ENERGY_DEMAND,
        queryVariables: {
          scenarios: config.scenario,
          iteration: yearToIteration[config.year],
          regions: config.provinces,
        },
      };
    }
    if (config.mainSelection === 'gasProduction') {
      return {
        query: GAS_PRODUCTIONS,
        queryVariables: {
          scenarios: config.scenario,
          iteration: yearToIteration[config.year],
          regions: config.provinces,
        },
      };
    }
    if (config.mainSelection === 'electricityGeneration') {
      return {
        query: ELECTRICITY_GENERATIONS,
        queryVariables: {
          scenarios: config.scenario,
          iteration: yearToIteration[config.year],
          regions: config.provinces,
        },
      };
    }
  }
  return { query: undefined, queryVariables: undefined };
};

// The default unit is the unit the db values are stored as.
const getDefaultUnit = (config) => {
  switch (config.mainSelection) {
    case 'gasProduction':
      return 'millionCubicMetres';

    case 'electricityGeneration':
      return 'gigawattHours';

    case 'oilProduction':
      return 'thousandCubicMetres';

    default:
      // energyDemand
      return 'petajoules';
  }
};

export default function () {
  const { config } = useContext(ConfigContext);
  const { query, queryVariables } = getQueryVariables(config);
  const defaultUnit = getDefaultUnit(config);
  const { loading, error, data } = useQuery(query, { variables: queryVariables });

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

    return {
      energyData: filteredData(data[`${config.mainSelection}s`]),
    };
  }, [config.mainSelection, config.unit, configFilter, data, defaultUnit, loading]);

  return { loading, error, processedData };
}
