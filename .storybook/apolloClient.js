import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { fetch } from 'whatwg-fetch';

import { API_HOST } from '../src/constants';

const cache = new InMemoryCache();
const link = new HttpLink({ uri: `${API_HOST}/energy-future/graphql` });

export default new ApolloClient({ cache, link, fetch });
