import gql from 'graphql-tag';

export const ENERGY_DEMAND = gql`
  query ($iteration: ID!, $regions: [Region!], $scenarios: [String!]) {
    resources:energyDemands(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sources: [ALL], sectors: ["total end-use"]) {
      province: region
      year
      scenario
      value: quantity
    }
  }
`;

export const GAS_PRODUCTIONS = gql`
  query ($iteration: ID!, $regions: [Region!], $scenarios: [String!]) {
    resources:gasProductions(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sources: [ALL] ){
        province: region
        year
        scenario
        value: quantity
      }
    }
  `;

export const ELECTRICITY_GENERATIONS = gql`
  query ($iteration: ID!, $regions: [Region!], $scenarios: [String!]) {
    resources:electricityGenerations(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sources: [ALL]) {
      province: region
      year
      scenario
      value: quantity
    }
  }
  `;

export const OIL_PRODUCTIONS = gql`
  query ($iteration: ID!, $regions: [Region!], $scenarios: [String!]) {
    resources:oilProductions(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios) {
      province: region
      year
      value: quantity
    }
  }
  `;

export const BY_SECTOR = gql`
  query ($iteration: ID!, $regions: [Region!], $scenarios: [String!], $sectors:[String!], $sources: [EnergySource!]) {
    resources:energyDemands(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sectors: $sectors, sources: $sources) {
      year
      value: quantity
      source
    }
  }
  `;

export const ELECTRICITY_GENERATIONS_SOURCE = gql`
  query ($iteration: ID!, $regions: [Region!], $scenarios: [String!]) {
    resources:electricityGenerations(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sources: []) {
      province: region
      year
      source
      value: quantity
    }
  }
  `;
export const NULL_QUERY = gql`{ _ }`;
