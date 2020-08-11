import { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { ConfigContext } from '../utilities/configContext';

const ENERGY_DEMAND = gql`
  query ($iteration: ID!, $regions: [Region!], $scenarios: [String!]) {
    energyDemands(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sources: [ALL], sectors: ["total end-use"]) {
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

const DEFAULT_RETURN = {
  loading: undefined,
  error: undefined,
  data: undefined,
};

export default function () {
  const { config } = useContext(ConfigContext);
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
  }
  if (query) {
    const { loading, error, data } = useQuery(query, { variables: queryVariables });
    return { loading, error, data };
  }
  return DEFAULT_RETURN;
}
