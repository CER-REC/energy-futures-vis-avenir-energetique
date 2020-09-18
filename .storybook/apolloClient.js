import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { fetch } from 'whatwg-fetch';

const cache = new InMemoryCache();
const link = new HttpLink({ uri: '/energy-future/graphql' });

export default new ApolloClient({ cache, link, fetch });
