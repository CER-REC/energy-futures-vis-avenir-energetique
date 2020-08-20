import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { makeDecorator } from '@storybook/addons';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

const cache = new InMemoryCache();
const link = new HttpLink({ uri: '/energy-future/graphql' });
const client = new ApolloClient({ cache, link, fetch });

const addGQL = (storyFn, context) => (
  <ApolloProvider client={client}>{storyFn(context)}</ApolloProvider>
);

export default makeDecorator({
  name: 'withGQL',
  allowDeprecatedUsage: false,
  wrapper: (getStory, context) => addGQL(getStory, context),
});
