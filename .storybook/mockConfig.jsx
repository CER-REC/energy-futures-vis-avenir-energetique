import React, { createContext, useContext, useMemo } from 'react';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';

import useAPI from '../src/hooks/useAPI';
import i18nMessages from '../src/i18n';
import { NOOP } from '../src/utilities/parseData';

const ConfigContext = createContext();

export const MockConfigProvider = ({ children, mockConfig, mockConfigDispatch }) => {
  const { translations } = useAPI();

  const messages = useMemo(
    () => ({ ...translations.en, ...i18nMessages.en }),
    [translations],
  );

  return (
    <ConfigContext.Provider value={{ config: mockConfig, configDispatch: mockConfigDispatch }}>
      <IntlProvider locale="en" defaultLocale="en" messages={messages}>
        {children}
      </IntlProvider>
    </ConfigContext.Provider>
  );
};

MockConfigProvider.propTypes = {
  children: PropTypes.node,
  mockConfig: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  mockConfigDispatch: PropTypes.func,
};

MockConfigProvider.defaultProps = {
  children: null,
  mockConfig: {},
  mockConfigDispatch: NOOP,
};

export default () => useContext(MockConfigProvider);
