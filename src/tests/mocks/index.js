import * as queries from '../../hooks/queries';
import iterationsTranslations from './iterationsTranslations.json';
import mockData from './mockData.json';
import mockOilData from './mockOilData.json';

export default [{
  request: { query: queries.ITERATIONS_TRANSLATIONS },
  result: iterationsTranslations,
},
{
  request: {
    query: queries.ENERGY_DEMAND,
    variables: { scenarios: ['Evolving'], iteration: '6', regions: ['AB'], sources: undefined, sectors: undefined },
  },
  result: mockData,
},
{
  request: {
    query: queries.BY_SECTOR,
    variables: { scenarios: ['Evolving'], iteration: '6', regions: ['AB'], sources: ['BIO'], sectors: 'ALL' },
  },
  result: mockData,
},
{
  request: {
    query: queries.ELECTRICITY_GENERATIONS_REGION,
    variables: { scenarios: ['Evolving'], iteration: '6', regions: ['AB'], sources: ['ALL'], sectors: undefined },
  },
  result: mockData,
},
{
  request: {
    query: queries.OIL_PRODUCTIONS,
    variables: { iteration: '6', scenarios: ['Evolving'], regions: ['AB'], sources: ['ISB'], sectors: undefined },
  },
  result: mockOilData,
},
];
