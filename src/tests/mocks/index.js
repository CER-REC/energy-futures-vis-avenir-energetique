import * as queries from '../../hooks/queries';
import iterationsTranslations from './iterationsTranslations.json';
import mockData from './mockData.json';

export default [{
  request: { query: queries.ITERATIONS_TRANSLATIONS },
  result: iterationsTranslations,
},
{
  request: { query: queries.ENERGY_DEMAND, variables: { scenarios: ['Evolving'], iteration: '6', regions: ['AB'], sources: undefined, sectors: undefined } },
  result: mockData,
}];
