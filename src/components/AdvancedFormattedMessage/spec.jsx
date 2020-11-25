import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';

import AdvancedFormattedMessage from '.';

const noop = () => {};

describe('Component|AdvancedFormattedMessage', () => {
  describe('with default props', () => {
    const values = { a: noop, b: noop };
    const wrapper = shallow(
      <AdvancedFormattedMessage
        id="testing"
        tag="h3"
        values={values}
        someProp="hello"
        anotherProp="world"
      />,
    );

    test('should render a FormattedMessage', () => {
      expect(wrapper.type()).toBe(FormattedMessage);
    });

    test('should pass the given locale id down to the FormattedMessage', () => {
      expect(wrapper.props().id).toEqual('testing');
    });

    test('should pass any given values down to the FormattedMessage', () => {
      expect(wrapper.props().values).toEqual(values);
    });

    test('should pass the FormattedMessage a child with the given tag', () => {
      const child = wrapper.shallowWithIntl({ testing: 'testing!' });
      expect(child.type()).toBe('h3');
    });

    test('should pass on any other props to the child', () => {
      const child = wrapper.shallowWithIntl({ testing: 'testing!' });
      expect(child.props().someProp).toBe('hello');
      expect(child.props().anotherProp).toBe('world');
    });
  });
});
