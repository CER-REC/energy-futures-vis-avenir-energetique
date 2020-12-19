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
