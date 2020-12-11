import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import nock from 'nock';
import { monkeyPatchShallowWithIntl } from './utilities';

jest.doMock('file-saver', () => ({ saveAs: jest.fn() }));
registerRequireContextHook();
configure({ adapter: new Adapter() });
monkeyPatchShallowWithIntl();
global.open = jest.fn();
global.location.assign = jest.fn();
global.fetch = fetch;

// Mock window.open
const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;
global.window.open = jest.fn();

// Nock
const bitlyDomain = 'http://localhost/bitlyService';
const testUri = '/api/bitlyShortlink?shortenUrl=http%3A%2F%2Flocalhost%2F%3Fpage%3Dlanding%26mainSelection%3D%26yearId%3D%26sector%3D%26unit%3D%26view%3D%26baseYear%3D%26compareYear%3D%26noCompare%3D%26scenarios%3D%26provinces%3D%26provinceOrder%3D%26sources%3D%26sourceOrder%3D';
nock(bitlyDomain, { allowUnmocked: true })
  .defaultReplyHeaders({ 'Access-Control-Allow-Origin': '*' })
  .get(testUri)
  .reply(200, {
    results: [{ data: { url: 'https://bit.ly/2W6hHBG ' } }],
  });
