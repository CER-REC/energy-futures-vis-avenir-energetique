import React, { Suspense } from 'react';
import enLocaleData from 'react-intl/locale-data/en';
import frLocaleData from 'react-intl/locale-data/fr';
import { IntlProvider, addLocaleData } from 'react-intl';
import i18nMessages from '../../i18n';
import { lang } from '../../constants';
import ErrorBoundary from '../../components/ErrorBoundary';
import UnsupportedWarning from '../../components/UnsupportedWarning';
import LoadingIndicator from '../../components/LoadingIndicator/index';

addLocaleData(enLocaleData);
addLocaleData(frLocaleData);

const LazyApp = React.lazy(() => import('./lazy'));

export default class AppWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      supportedResolution: window.innerWidth >= 746,
      // This will detect any version of IE up to and including IE11
      supportedBrowser: !(!!window.MSInputMethodContext && !!document.documentMode),
    };
  }

  render() {
    const content =
      (!this.state.supportedResolution && <UnsupportedWarning type="resolution" />) ||
      (!this.state.supportedBrowser && <UnsupportedWarning type="browser" />) ||
      (
        <Suspense fallback={<LoadingIndicator text="loading" fullHeight />}>
          <LazyApp />
        </Suspense>
      );

    return (
      <IntlProvider locale={lang} messages={i18nMessages[lang]}>
        <ErrorBoundary>
          {content}
        </ErrorBoundary>
      </IntlProvider>
    );
  }
}
