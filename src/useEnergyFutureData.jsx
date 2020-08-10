/* eslint-disable import/prefer-default-export */
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const ITERATIONS = gql`
query {
  iterations {
    year
    name
  }
}`;
const ENERGY_DEMAND = gql`
  query ($scenario: String!, $iteration: ID!, $sector: String!, $source: EnergySource!){
    energyDemands(scenarios: [$scenario],iterationIds: [$iteration], sectors: [$sector], sources:[$source]) {
      province: region
      year
      value: quantity
      source
      scenario
      sector
    }}
    `;

export default function (config) {
  let query;
  let queryVariables;

  if (config.page === 'yearSelect') {
    query = ITERATIONS;
    queryVariables = {};
  } else if (config.page === 'energyDemand') {
    query = ENERGY_DEMAND;
    queryVariables = {
      scenario: config.scenario,
      iteration: config.iteration,
      sector: config.sector,
      source: config.source,
    };
  }

  const { loading, error, data: response } = useQuery(query, { variables: queryVariables });

  return { loading, error, response };
}
