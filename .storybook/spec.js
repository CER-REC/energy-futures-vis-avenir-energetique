import initStoryshots from '@storybook/addon-storyshots';
import { SynchronousPromise } from 'synchronous-promise';

import client from './mockApolloClient';

// initStoryshots runs Storybook's configuration and needs "configure" to be called synchronously
global.Promise = SynchronousPromise;

jest.doMock('./apolloClient', () => client);

jest.doMock('./addon-status', () => jest.fn((storyFnOuter, contextOuter) => {
  if (typeof storyFnOuter === 'function') { return storyFnOuter(contextOuter); }
  return (storyFn, context) => storyFn(context);
}));

// This fixes an issue with Jest sometimes ignoring the storybook spec, since it
// doesn't directly define a test.
beforeAll(() => {});

initStoryshots();
