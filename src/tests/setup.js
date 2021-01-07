import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { monkeyPatchShallowWithIntl } from './utilities';

registerRequireContextHook();
configure({ adapter: new Adapter() });
monkeyPatchShallowWithIntl();
global.open = jest.fn();
global.location.assign = jest.fn();

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
