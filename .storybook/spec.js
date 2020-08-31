import initStoryshots from '@storybook/addon-storyshots';

jest.doMock('./addon-status', () => jest.fn((storyFnOuter, contextOuter) => {
  if (typeof storyFnOuter === 'function') { return storyFnOuter(contextOuter); }
  return (storyFn, context) => storyFn(context);
}));

// This fixes an issue with Jest sometimes ignoring the storybook spec, since it
// doesn't directly define a test.
beforeAll(() => {});

initStoryshots();
