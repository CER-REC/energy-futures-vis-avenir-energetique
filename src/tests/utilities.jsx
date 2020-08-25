import { ShallowWrapper, shallow, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';

import i18nMessages from '../i18n';

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
