import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { ShallowWrapper, mount } from 'enzyme';
import { ApolloProvider } from '@apollo/react-hooks';
import client from './mocks/apolloClient';
import useAPI from '../hooks/useAPI';
import { ConfigProvider } from '../hooks/useConfig';
import i18nMessages from '../i18n';
import { NOOP } from '../utilities/parseData';

/**
 * Verify whether a specific component can be found in the given wrapper.
 */
export const getRendered = (component, wrapper) => {
  if (wrapper instanceof ShallowWrapper) { return wrapper; }
  return wrapper.find(component).childAt(0);
};

/**
 * Mount a component with i18n for testing.
 * Use this one if config and apollo are not needed.
 */
export const mountWithIntl = (node, messages) => mount(node, {
  wrappingComponent: IntlProvider,
  wrappingComponentProps: {
    locale: 'en',
    messages: messages || i18nMessages.en,
  },
});

/**
 * A wrapper that has i18n, config, and apollo providers built-in for simulating real components.
 */
export const TestContainer = ({ children, mockConfig, mockConfigDispatch }) => {
  const Root = () => {
    const { translations } = useAPI();
    const messages = useMemo(
      () => ({ ...translations.en, ...i18nMessages.en, about: ' ' }),
      [translations],
    );
    return (
      <IntlProvider locale="en" defaultLocale="en" messages={messages}>
        <ConfigProvider mockConfig={mockConfig} mockConfigDispatch={mockConfigDispatch}>
          {children}
        </ConfigProvider>
      </IntlProvider>
    );
  };
  return <ApolloProvider client={client}><Root /></ApolloProvider>;
};

TestContainer.propTypes = {
  children: PropTypes.node,
  mockConfig: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  mockConfigDispatch: PropTypes.func,
};

TestContainer.defaultProps = {
  children: null,
  mockConfig: undefined,
  mockConfigDispatch: NOOP,
};
