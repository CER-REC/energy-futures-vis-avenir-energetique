import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { MATCH_ANY_PARAMETERS, WildcardMockLink } from 'wildcard-mock-link';

import * as queries from '../../hooks/queries';
import iterationsTranslations from './iterationsTranslations.json';
import mockData from './data.json';

/**
 * mock the query that takes wild cards for testing the useEnergyFutureData hook
 */
const cache = new InMemoryCache({ addTypename: false });
const mocks = [
  {
    request: { query: queries.ITERATIONS_TRANSLATIONS },
    result: iterationsTranslations,
  },
  ...Object.keys(queries).map(query => !['ITERATIONS_TRANSLATIONS', 'NULL_QUERY'].includes(query) && ({
    request: { query: queries[query], variables: MATCH_ANY_PARAMETERS },
    result: mockData,
  })).filter(Boolean),
];
const link = new WildcardMockLink(mocks, false);
const client = new ApolloClient({ cache, link });

// Need to write data to cache for Storybook snapshots
// Apollo's MockLink uses timeouts to simulate requests from links instead of cache
// Synchronous Promise won't be able to run the query requests synchronously if they are not cached
// Storybook snapshots need the "configure" for Storybooks configuration to be called synchronously
mocks.forEach(mock => client.writeQuery({
  query: mock.request.query,
  data: mock.result.data,
}));

export default client;
