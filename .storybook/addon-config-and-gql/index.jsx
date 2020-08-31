import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { makeDecorator } from '@storybook/addons';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { fetch } from 'whatwg-fetch';

import { ConfigProvider } from '../../src/hooks/useConfig';

const cache = new InMemoryCache();
const link = new HttpLink({ uri: '/energy-future/graphql' });
const client = new ApolloClient({ cache, link, fetch });

const addConfigAndGQL = (storyFn, context) => (
  <ApolloProvider client={client}>
    <ConfigProvider>{storyFn(context)}</ConfigProvider>
  </ApolloProvider>
);

export default makeDecorator({
  name: 'withConfigAndGQL',
  allowDeprecatedUsage: false,
  wrapper: (getStory, context) => addConfigAndGQL(getStory, context),
});
