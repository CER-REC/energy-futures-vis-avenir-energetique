import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import fetch from 'node-fetch';

registerRequireContextHook();
configure({ adapter: new Adapter() });

/**
 * jest related:
 */
jest.doMock('file-saver', () => ({ saveAs: jest.fn() }));

/**
 * To get rid of the 'unable to find drag handle' error.
 * https://github.com/atlassian/react-beautiful-dnd/issues/1593
 */
jest.mock('react-beautiful-dnd', () => ({
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

/**
 * global related:
 */
global.fetch = fetch;

// silent warning messages
global.console = { ...global.console, warn: jest.fn() };

// Mock window.open
global.open = jest.fn();
global.location.assign = jest.fn();

/**
 * Fixes a known issue when testing Material UI Tooltip.
 * https://github.com/mui-org/material-ui/issues/15726
 */
global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

global.document = global.window.document;
global.window.open = global.open;

// Define is needed to override the location assign function references
Object.defineProperty(global.window, 'location', {
  value: {
    ...global.window.location,
    assign: global.location.assign,
  },
});
