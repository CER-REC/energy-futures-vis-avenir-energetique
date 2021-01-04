import React, { Suspense, useMemo } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { IntlProvider } from 'react-intl';
import { fetch } from 'whatwg-fetch';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-pluralrules/locale-data/fr';
import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/locale-data/en';
import '@formatjs/intl-relativetimeformat/locale-data/fr';

import { lang, API_HOST } from '../../constants';
import i18nMessages from '../../i18n';
import aboutEnglish from '../../languages/about.english.md';
import aboutFrench from '../../languages/about.french.md';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingIndicator from '../../components/LoadingIndicator';
import UnsupportedWarning from '../../components/UnsupportedWarning';
import useAPI from '../../hooks/useAPI';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: `${API_HOST}/energy-future/graphql`,
  credentials: 'same-origin',
});
const client = new ApolloClient({ cache, link, fetch });
const LazyApp = React.lazy(() => import('./lazy'));

const Loader = () => {
  let content;
  const { loading, error, translations } = useAPI();
  const messages = useMemo(
    () => ({ ...translations[lang], ...i18nMessages[lang], about: lang === 'fr' ? aboutFrench : aboutEnglish }),
    [translations],
  );

  if (window.innerWidth < 746) {
    content = <UnsupportedWarning type="resolution" />;
  // This will detect any version of IE up to and including IE11
  } else if (window.MSInputMethodContext && document.documentMode) {
    content = <UnsupportedWarning type="browser" />;
  } else if (loading) {
    content = <LoadingIndicator type="api" fullHeight />;
  } else if (error) {
    // TODO: Implement error message
    content = 'Error';
  } else {
    content = (
      <Suspense fallback={<LoadingIndicator type="app" fullHeight />}>
        <LazyApp />
      </Suspense>
    );
  }

  return (
    <IntlProvider locale={lang} defaultLocale={lang} messages={messages}>
      <ErrorBoundary>
        {content}
      </ErrorBoundary>
    </IntlProvider>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <Loader />
  </ApolloProvider>
);
