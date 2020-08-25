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

const BY_SECTOR = gql`
query ($iteration: ID!, $regions: [Region!], $scenarios: [String!], $sectors:[String!], $sources: [EnergySource!]) {
  resources:energyDemands(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sectors: $sectors, sources: $sources) {
    year
    value: quantity
    source
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
  if ((config.page === 'by-sector') && (config.provinces)) {
    // #region Enum Correction
    // TODO: fix the config data to match the enums then remove this next part
    // and replace correctedSources with config.sources
    const correctedSources = [...config.sources];

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
    // #endregion

    if (correctedSources.length) {
      return {
        query: BY_SECTOR,
        queryVariables: {
          scenarios: config.scenario,
          iteration: yearToIteration[config.year],
          regions: config.provinces,
          // FIXME: config will store it as "total"
          // it should be "total end-use"
          sectors: config.sector === 'total' ? 'total end-use' : config.sector,
          sources: correctedSources,
        },
      };
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
  const unitConversion = convertUnit(getDefaultUnit(config), config.unit);

  if (!query) { return { loading: false, error: undefined, data: [] }; }
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

    if (config.page === 'by-sector') {
      const filteredData = {};

      data.resources.forEach((entry) => {
        if (filteredData[entry.year]) {
          filteredData[entry.year][entry.source] = entry.value * unitConversion;
        } else if (entry.source !== 'ALL') {
          filteredData[entry.year] = { [entry.source]: entry.value * unitConversion };
        }
      });

      return Object.keys(filteredData).map(entry => filteredData[entry]);
    }

    if (config.page === 'by-region') {
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
            result[curr.year][curr.province] += (
              curr.value * unitConversion
            );
            return result;
          }, {});
        return Object.keys(byYear).map(year => ({ year, ...byYear[year] }));
      };

      return filteredData(data.resources);
    }

    return undefined;
  }, [config.page, configFilter, data, unitConversion]);

  return { loading, error, data: processedData };
}
