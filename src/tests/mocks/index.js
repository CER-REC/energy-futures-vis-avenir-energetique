import * as queries from '../../hooks/queries';
import iterationsTranslations from './iterationsTranslations.json';

export default [{
  request: { query: queries.ITERATIONS_TRANSLATIONS },
  result: iterationsTranslations,
}];
