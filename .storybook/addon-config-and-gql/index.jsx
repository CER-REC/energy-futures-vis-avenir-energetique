import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { makeDecorator } from '@storybook/addons';

import { ConfigProvider } from '../../src/hooks/useConfig';
import client from '../apolloClient';

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
