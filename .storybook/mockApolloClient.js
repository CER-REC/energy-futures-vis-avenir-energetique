import { MockLink } from '@apollo/react-testing';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import mocks from '../src/tests/mocks';

const cache = new InMemoryCache({ addTypename: false });
const link = new MockLink(mocks, false);
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
