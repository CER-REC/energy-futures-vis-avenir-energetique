import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import fetch from 'node-fetch';
import { monkeyPatchShallowWithIntl } from './utilities';

jest.doMock('file-saver', () => ({ saveAs: jest.fn() }));
registerRequireContextHook();
configure({ adapter: new Adapter() });
monkeyPatchShallowWithIntl();
global.fetch = fetch;

// Mock window.open
global.open = jest.fn();
global.location.assign = jest.fn();
global.document = global.window.document;
global.window.open = global.open;

// Define is needed to override the location assign function references
Object.defineProperty(global.window, 'location', {
  value: {
    ...global.window.location,
    assign: global.location.assign,
  },
});
