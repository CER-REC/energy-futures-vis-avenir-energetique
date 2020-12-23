import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { ShallowWrapper, shallow, mount } from 'enzyme';
import { ApolloProvider } from '@apollo/react-hooks';
import client from '../../.storybook/mockApolloClient';
import useAPI from '../hooks/useAPI';
import { ConfigProvider } from '../hooks/useConfig';
import i18nMessages from '../i18n';
import { NOOP } from '../utilities/parseData';

// TODO: Create custom 'test' locale with a blank plural rule to use when custom messages are tested
const defaultLocale = 'en';
const defaultMessages = i18nMessages.en;

export const monkeyPatchShallowWithIntl = () => {
  ShallowWrapper.prototype.shallowWithIntl = function shallowWithIntl(messages) {
    // Shallow twice to get pass the context provider
    return this.shallow().shallow({
      wrappingComponent: IntlProvider,
      wrappingComponentProps: {
        locale: defaultLocale,
        messages: messages || defaultMessages,
      },
    });
  };
};

export const shouldBehaveLikeAComponent = (rawComponent, callback) => {
  let component = rawComponent.WrappedComponent || rawComponent;
  if (component.$$typeof === Symbol.for('react.memo')) {
    component = component.type;
  }

  it('should render with the component name as a class', () => {
    const wrapper = callback();

    const getRendered = () => {
      if (wrapper instanceof ShallowWrapper) { return wrapper; }
      return wrapper.find(component).childAt(0);
    };

    expect(getRendered().hasClass(component.name)).toBe(true);
    // Disabling this rule is safe because prop-types are only stripped in prod
    // eslint-disable-next-line react/forbid-foreign-prop-types
    if (component.propTypes && component.propTypes.className) {
      wrapper.setProps({ className: 'testClass' });
      const rendered = getRendered();
      // Ensure the component name is still a class
      expect(rendered.hasClass(component.name)).toBe(true);
      // Check that the new class was added
      expect(rendered.hasClass('testClass')).toBe(true);
    }
  });
};

export const shouldHaveInteractionProps = (wrapper) => {
  const props = wrapper.props();
  expect(props.onClick).toBeInstanceOf(Function);
  expect(props.onKeyPress).toBeInstanceOf(Function);
  expect(props.tabIndex).toBe(0);
  expect(props.focusable).toBe(true);
};

export const shallowWithIntl = (node, messages) => shallow(node, {
  wrappingComponent: IntlProvider,
  wrappingComponentProps: {
    locale: defaultLocale,
    messages: messages || defaultMessages,
  },
});

export const mountWithIntl = (node, messages) => mount(node, {
  wrappingComponent: IntlProvider,
  wrappingComponentProps: {
    locale: defaultLocale,
    messages: messages || defaultMessages,
  },
});

export const compareReduxChange = (reducer, newState) => {
  const initialState = reducer(undefined, {});
  expect(newState).not.toBe(initialState);
  expect(typeof initialState).toBe(typeof newState);
};

/**
 * TODO: newly added helper functions.
 */
export const TestContainer = ({ children, mockConfig, mockConfigDispatch, apolloClient }) => {
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
  return <ApolloProvider client={apolloClient || client}><Root /></ApolloProvider>;
};

TestContainer.propTypes = {
  children: PropTypes.node,
  mockConfig: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  mockConfigDispatch: PropTypes.func,
  apolloClient: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

TestContainer.defaultProps = {
  children: null,
  mockConfig: undefined,
  mockConfigDispatch: NOOP,
  apolloClient: undefined,
};

export const getRendered = (component, wrapper) => {
  if (wrapper instanceof ShallowWrapper) { return wrapper; }
  return wrapper.find(component).childAt(0);
};
