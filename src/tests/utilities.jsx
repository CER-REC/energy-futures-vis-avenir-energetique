import React from 'react';
import { ShallowWrapper, shallow, mount } from 'enzyme';
import { IntlProvider, addLocaleData, intlShape } from 'react-intl';
import i18nMessages from '../i18n';

const intlProvider = new IntlProvider({ locale: 'en', messages: i18nMessages.en }, {});
const { intl } = intlProvider.getChildContext();
const nodeWithIntlProp = node => React.cloneElement(node, { intl });

addLocaleData({
  locale: 'test',
  pluralRuleFunction: () => {},
});

export const monkeyPatchShallowWithIntl = () => {
  ShallowWrapper.prototype.shallowWithIntl = function shallowWithIntl(messages) {
    let testIntl = intl;

    if (messages) {
      const testIntlProvider = new IntlProvider({ locale: 'test', messages }, {});

      testIntl = testIntlProvider.getChildContext().intl;
    }

    return this.shallow({ context: { intl: testIntl } });
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

export const shallowWithIntl = (node, messages) => {
  let testIntl = intl;

  if (messages) {
    const testIntlProvider = new IntlProvider({ locale: 'test', messages }, {});

    testIntl = testIntlProvider.getChildContext().intl;
  }

  return shallow(
    nodeWithIntlProp(node),
    {
      context: { intl: testIntl },
    },
  ).shallow();
};

export const mountWithIntl = (node, { context, childContextTypes, ...opts } = {}) => mount(
  nodeWithIntlProp(node),
  {
    context: { ...context, intl },
    childContextTypes: { intl: intlShape, ...childContextTypes },
    ...opts,
  },
);

export const compareReduxChange = (reducer, newState) => {
  const initialState = reducer(undefined, {});
  expect(newState).not.toBe(initialState);
  expect(typeof initialState).toBe(typeof newState);
};
