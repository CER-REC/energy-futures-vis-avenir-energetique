import React from 'react';
import { mount } from 'enzyme';
import FillLayer from '.';

const MOCK_CHART = {
  areaGenerator: () => [],
  series: [
    { id: 'OIL', data: [{ position: { x: 0, y: 0 } }], color: '#FF821E' },
    { id: 'GAS', data: [{ position: { x: 0, y: 0 } }], color: '#890038' },
    { id: 'ELECTRICITY', data: [{ position: { x: 0, y: 0 } }], color: '#7ACBCB' },
    { id: 'COAL', data: [{ position: { x: 0, y: 0 } }], color: '#4B5E5B' },
    { id: 'BIO', data: [{ position: { x: 0, y: 0 } }], color: '#1C7F24' },
  ],
};

describe('Component|FillLayer', () => {
  /**
   * Page By-Sector
   */
  describe('Test in page by-sector', () => {
    const wrapper = mount(<svg>{FillLayer()(MOCK_CHART)}</svg>);

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
      expect(wrapper.findWhere(node => node.type() === 'g' && node.prop('opacity') === 0.7).exists()).toBeTruthy();
    });
  });

  /**
   * Transportation
   */
  describe('Test sector transportation', () => {
    const wrapper = mount(
      <svg>{FillLayer(true)(MOCK_CHART)}</svg>,
    );

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
      expect(wrapper.findWhere(node => node.type() === 'g' && node.prop('opacity') === 0.7).exists()).toBeTruthy();
    });
  });
});
