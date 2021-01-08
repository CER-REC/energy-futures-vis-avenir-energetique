import initStoryshots, { snapshotWithOptions } from '@storybook/addon-storyshots';
import { SynchronousPromise } from 'synchronous-promise';
import client from '../src/tests/mocks/apolloClient';

// initStoryshots runs Storybook's configuration and needs "configure" to be called synchronously
global.Promise = SynchronousPromise;

jest.doMock('./apolloClient', () => client);

jest.doMock('./addon-status', () => jest.fn((storyFnOuter, contextOuter) => {
  if (typeof storyFnOuter === 'function') { return storyFnOuter(contextOuter); }
  return (storyFn, context) => storyFn(context);
}));

/**
 * To get rid of the 'unable to find drag handle' error.
 * https://github.com/atlassian/react-beautiful-dnd/issues/1593
 */
jest.doMock('react-beautiful-dnd', () => ({
  Droppable: ({ children }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
  }, {}),
  Draggable: ({ children }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
  }, {}),
  DragDropContext: ({ children }) => children,
}));

// This fixes an issue with Jest sometimes ignoring the storybook spec, since it
// doesn't directly define a test.
beforeAll(() => {});

initStoryshots({
  test: snapshotWithOptions({
    createNodeMock: (element) => {
      // Mock ref for Material UI slider
      if (element.props.className?.indexOf('MuiSlider-root') !== -1) {
        return document.createElement(element.type);
      }

      return null;
    },
  }),
});
