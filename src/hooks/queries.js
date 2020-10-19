import gql from 'graphql-tag';

export const ENERGY_DEMAND = gql`
  query ($iteration: ID!, $regions: [Region!], $scenarios: [String!]) {
    resources:energyDemands(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sources: [ALL], sectors: [ALL]) {
      province: region
      year
      scenario
      value: quantity
    }
  }
`;

export const GAS_PRODUCTIONS = gql`
  query ($iteration: ID!, $regions: [Region!], $scenarios: [String!], $sources: [GasSource!]) {
    resources:gasProductions(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sources: $sources ){
        province: region
        year
        scenario
        value: quantity
        source
      }
    }
`;

export const GAS_PRODUCTIONS_ALL = gql`
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
  query ($iteration: ID!, $regions: [Region!], $scenarios: [String!], $sources:[OilSource!]) {
    resources:oilProductions(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sources: $sources) {
      province: region
      year
      source
      value: quantity
    }
  }
`;

export const OIL_PRODUCTIONS_ALL = gql`
  query ($iteration: ID!, $regions: [Region!], $scenarios: [String!]) {
    resources:oilProductions(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sources: [ALL]) {
      province: region
      year
      scenario
      value: quantity
    }
  }
`;

export const BY_SECTOR = gql`
  query ($iteration: ID!, $regions: [Region!], $scenarios: [String!], $sectors: [EnergySector!], $sources: [EnergySource!]) {
    resources:energyDemands(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sectors: $sectors, sources: $sources) {
      year
      value: quantity
      source
    }
  }
`;

export const ELECTRICITY_GENERATIONS_REGION = gql`
  query ($iteration: ID!, $regions: [Region!], $scenarios: [String!]) {
    resources:electricityGenerations(iterationIds: [$iteration], scenarios: $scenarios, regions: $regions, sources: []) {
      province: region
      year
      source
      value: quantity
    }
  }
`;

export const ELECTRICITY_GENERATIONS_SOURCE = gql`
  query ($iteration: ID!, $sources: [ElectricitySource!], $scenarios: [String!]) {
    resources:electricityGenerations(iterationIds: [$iteration], scenarios: $scenarios, regions: [], sources: $sources) {
      province: region
      year
      source
      value: quantity
    }
  }
`;

export const ITERATIONS_TRANSLATIONS = gql`
  query {
    iterations {
      id
      year
      scenarios
    }
    translations {
      group
      key
      english
      french
    }
  }
`;

export const NULL_QUERY = gql`{ _ }`;
