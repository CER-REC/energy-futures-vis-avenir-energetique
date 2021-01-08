import React from 'react';
import { mount } from 'enzyme';
import forecastLayer from '.';

const MOCK_YEAR = { year: { min: 2005, max: 2050, forecastStart: 2018 } };

describe('Component|ForecastLayer', () => {
  /**
   * Chart with props 'innerHeight' and 'innerWidth'
   */
  describe('Test basic component', () => {
    const wrapper = mount(
      <svg>{forecastLayer(MOCK_YEAR)({ innerHeight: 600, innerWidth: 800 })}</svg>,
    );

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
      expect(wrapper.findWhere(node => node.type() === 'text' && node.text() === 'forecast').exists()).toBeTruthy();
    });

    test('should NOT render component without valid years', () => {
      expect(forecastLayer({ year: undefined })()).toBeNull();
    });
  });

  /**
   * Chart with props 'height' and 'width'
   */
  describe('Test basic component', () => {
    const wrapper = mount(<svg>{forecastLayer(MOCK_YEAR)({ height: 600, width: 800 })}</svg>);

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
      expect(wrapper.findWhere(node => node.type() === 'text' && node.text() === 'forecast').exists()).toBeTruthy();
    });

    test('should NOT render component without valid years', () => {
      expect(forecastLayer({ year: undefined })()).toBeNull();
    });
  });
});
