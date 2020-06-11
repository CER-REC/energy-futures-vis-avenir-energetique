import requireContext from 'require-context.macro';
import React from 'react';
import { setIntlConfig, withIntl } from 'storybook-addon-intl';
import { addDecorator, configure, addParameters } from '@storybook/react';
import Adapter from 'enzyme-adapter-react-16';
import { configure as enzyme } from 'enzyme';
import { addReadme, configureReadme } from 'storybook-readme';


// Load Locale Data
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import frLocaleData from 'react-intl/locale-data/fr';

import { lang } from '../src/constants';
import i18nMessages from '../src/i18n';


addLocaleData(enLocaleData);
addLocaleData(frLocaleData);

setIntlConfig({
  locales: ['en', 'fr'],
  defaultLocale: lang,
  getMessages: locale => i18nMessages[locale],
});

addDecorator(withIntl);

addDecorator(addReadme);
configureReadme({
  // eslint-disable-next-line react/prop-types
  DocPreview: ({ children }) => (
    <div style={{ padding: '40px 40px 0' }}> {children}</div>
  ),
});

const viewports = {
  fullscreen: {
    name: 'Fullscreen',
    styles: { width: '100%', height: '100%' },
  },
  desktop: {
    name: 'Desktop',
    styles: { width: '1200px', height: '100%' },
  },
  laptop: {
    name: 'Laptop',
    styles: { width: '1000px', height: '100%' },
  },
  ipad: {
    name: 'iPad',
    styles: { width: '768px', height: '100%' },
  },
};
addParameters({ viewport: { viewports, defaultViewport: 'fullscreen' } });

addParameters({
  options: {
    brandTitle: 'Energy Future 2.0 DevDoc',
    panelPosition: 'bottom',
  },
});

addDecorator((storyFn, context) => {
  if (context.id === 'containers-app--within-wet') { return storyFn(); }
  return <div className="visualization">{storyFn()}</div>;
});

// automatically import all files named stories.jsx
const documentationStories = requireContext('../documentation/', true, /stories.jsx$/);
const componentStories = requireContext('../src/', true, /stories.jsx$/);
const containerOrder = [
  './containers/ViewOne/stories.jsx',
  './containers/ViewTwo/stories.jsx',
  './containers/ViewThree/stories.jsx',
  './containers/Footer/stories.jsx',
];
function loadStories() {
  documentationStories.keys()
    // Sorting Documentation|Introduction to the top
    .sort((a, b) => (a.startsWith('./Introduction/') ? -1 : a.localeCompare(b)))
    .forEach(filename => documentationStories(filename));
  componentStories.keys()
    .sort((a, b) => {
      if (!a.startsWith('./containers/') || !b.startsWith('./containers/')) { return 0; }
      // This is a container, so sort it by usage
      return containerOrder.indexOf(a) - containerOrder.indexOf(b);
    })
    .forEach(filename => componentStories(filename));
}

enzyme({ adapter: new Adapter() });
configure(loadStories, module);
