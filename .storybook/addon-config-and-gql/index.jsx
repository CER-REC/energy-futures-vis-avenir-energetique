import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { makeDecorator } from '@storybook/addons';

import { ConfigProvider } from '../../src/hooks/useConfig';
import client from '../apolloClient';

const addConfigAndGQL = (storyFn, context) => {
  const mockConfig = {
    ...(context?.parameters?.mockConfigBasic || {}),
    ...(context?.parameters?.mockConfigExtra || {}),
  };
  return (
    <ApolloProvider client={client}>
      <ConfigProvider mockConfig={mockConfig}>{storyFn(context)}</ConfigProvider>
    </ApolloProvider>
  );
};

export default makeDecorator({
  name: 'withConfigAndGQL',
  allowDeprecatedUsage: false,
  wrapper: (getStory, context) => addConfigAndGQL(getStory, context),
});
