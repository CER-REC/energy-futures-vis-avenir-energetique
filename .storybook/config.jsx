import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import { addDecorator, configure, addParameters } from '@storybook/react';
import Adapter from 'enzyme-adapter-react-16';
import { configure as enzyme } from 'enzyme';
import requireContext from 'require-context.macro';
import { setIntlConfig, withIntl } from 'storybook-addon-intl';
import { addReadme, configureReadme } from 'storybook-readme';

// Load Locale Data
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-pluralrules/locale-data/fr';
import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/locale-data/en';
import '@formatjs/intl-relativetimeformat/locale-data/fr';

import client from './apolloClient';
import { lang } from '../src/constants';
import i18nMessages from '../src/i18n';
import { ITERATIONS_TRANSLATIONS } from '../src/hooks/queries';
import getI18NMessages from '../src/utilities/getI18NMessages';
import theme from '../src/containers/App/theme';

const locales = Object.keys(i18nMessages);
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

client.query({ query: ITERATIONS_TRANSLATIONS }).then((result) => {
  const apiI18NMessages = getI18NMessages(result.data.translations);
  const messages = {};

  locales.forEach((locale) => {
    messages[locale] = { ...apiI18NMessages[locale], ...i18nMessages[locale], about: ' ' };
  });

  setIntlConfig({
    locales,
    defaultLocale: lang,
    getMessages: locale => messages[locale],
  });
}).catch(() => {
  setIntlConfig({
    locales,
    defaultLocale: lang,
    getMessages: locale => i18nMessages[locale],
  });

  // eslint-disable-next-line no-console
  console.warn('Unable to load API translations.');
}).finally(() => {
  // Automatically import all files named stories.jsx
  const documentationStories = requireContext('../documentation/', true, /stories.jsx$/);
  const componentStories = requireContext('../src/', true, /stories.jsx$/);

  addDecorator(withIntl);
  addDecorator(addReadme);

  configureReadme({
    // eslint-disable-next-line react/prop-types
    StoryPreview: ({ children }) => (
      <div style={{ padding: '32px 32px 0' }}>{children}</div>
    ),
  });

  addParameters({ viewport: { viewports, defaultViewport: 'fullscreen' } });
  addParameters({
    options: {
      brandTitle: 'Energy Future 2.0 DevDoc',
      panelPosition: 'bottom',
    },
  });

  addDecorator((storyFn, context) => {
    if (context.id === 'containers-app--within-wet') { return storyFn(); }
    return <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>;
  });

  enzyme({ adapter: new Adapter() });

  configure(() => {
    documentationStories.keys()
      // Sorting Documentation|Introduction to the top
      .sort((a, b) => (a.startsWith('./Introduction/') ? -1 : a.localeCompare(b)))
      .forEach(filename => documentationStories(filename));
    componentStories.keys().forEach(filename => componentStories(filename));
  }, module);
});
