import gql from 'graphql-tag';

const gasProductionsAllResources = `
  resources:gasProductions(iterationIds: [$iteration], scenarios: $scenarios, sources: [ALL]) {
    province: region
    year
    scenario
    value: quantity
  }
`;

const oilProductionsAllResources = `
  resources:oilProductions(iterationIds: [$iteration], scenarios: $scenarios, sources: [ALL]) {
    province: region
    year
    scenario
    value: quantity
  }
`;

export const ENERGY_DEMAND = gql`
  query ($iteration: ID!, $scenarios: [String!]) {
    resources:energyDemands(iterationIds: [$iteration], scenarios: $scenarios, sources: [ALL], sectors: [ALL]) {
      province: region
      year
      scenario
      value: quantity
    }
  }
`;

export const GAS_PRODUCTIONS = gql`
  query ($iteration: ID!, $scenarios: [String!], $sources: [GasSource!]) {
    resources:gasProductions(iterationIds: [$iteration], scenarios: $scenarios, sources: $sources ){
      province: region
      year
      scenario
      value: quantity
      source
    }
  }
`;

export const GAS_PRODUCTIONS_ALL = gql`
  query ($iteration: ID!, $scenarios: [String!]) {
    ${gasProductionsAllResources}
  }
`;

export const GAS_PRODUCTIONS_ALL_WITH_PRICES = gql`
  query ($iteration: ID!, $scenarios: [String!], $priceSource: PriceSource!) {
    ${gasProductionsAllResources}
    prices:benchmarkPrices(iterationIds: [$iteration], scenarios: $scenarios, sources: [$priceSource]) {
      year
      scenario
      value: quantity
    }
  }
`;

export const ELECTRICITY_GENERATIONS = gql`
  query ($iteration: ID!, $scenarios: [String!]) {
    resources:electricityGenerations(iterationIds: [$iteration], scenarios: $scenarios, sources: [ALL]) {
      province: region
      year
      scenario
      value: quantity
    }
  }
`;

export const OIL_PRODUCTIONS = gql`
  query ($iteration: ID!, $scenarios: [String!], $sources:[OilSource!]) {
    resources:oilProductions(iterationIds: [$iteration], scenarios: $scenarios, sources: $sources) {
      province: region
      year
      source
      value: quantity
    }
  }
`;

export const OIL_PRODUCTIONS_ALL = gql`
  query ($iteration: ID!, $scenarios: [String!]) {
    ${oilProductionsAllResources}
  }
`;

export const OIL_PRODUCTIONS_ALL_WITH_PRICES = gql`
  query ($iteration: ID!, $scenarios: [String!], $priceSource: PriceSource!) {
    ${oilProductionsAllResources}
    prices:benchmarkPrices(iterationIds: [$iteration], scenarios: $scenarios, sources: [$priceSource]) {
      year
      scenario
      value: quantity
    }
  }
`;

export const BY_SECTOR = gql`
  query ($iteration: ID!, $scenarios: [String!], $sectors: [EnergySector!], $sources: [EnergySource!]) {
    resources:energyDemands(iterationIds: [$iteration], scenarios: $scenarios, sectors: $sectors, sources: $sources) {
      province: region
      year
      value: quantity
      source
    }
  }
`;

export const ELECTRICITY_GENERATIONS_REGION = gql`
  query ($iteration: ID!, $scenarios: [String!]) {
    resources:electricityGenerations(iterationIds: [$iteration], scenarios: $scenarios, sources: []) {
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

export const GREENHOUSE_GAS_EMISSIONS_SOURCE = gql`
  query ($iteration: ID!, $sources: [GreenhouseGasSource!], $scenarios: [String!]) {
    resources:greenhouseGasEmissions(iterationIds: [$iteration], scenarios: $scenarios, sources: $sources) {
      year
      scenario
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
