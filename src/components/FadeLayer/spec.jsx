import React from 'react';
import { mount } from 'enzyme';
import { fadeLayerBySector, fadeLayerScenario } from '.';

const MOCK_YEAR = { year: { min: 2005, max: 2050, forecastStart: 2018 } };

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

describe('Component|FadeLayer', () => {
  /**
   * Page By-Sector
   */
  describe('Test in page by-sector', () => {
    const wrapper = mount(<svg>{fadeLayerBySector(MOCK_YEAR)(MOCK_CHART)}</svg>);

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
      expect(wrapper.findWhere(node => node.type() === 'g' && node.prop('opacity') === 0.7).exists()).toBeTruthy();

      // verify linear gradients
      const gradients = wrapper.findWhere(node => node.type() === 'linearGradient').map(node => node.prop('id'));
      expect(gradients.sort()).toEqual(MOCK_CHART.series.map(line => `line-${line.id}-gradient`).sort());
    });

    test('should NOT render component without valid years', () => {
      expect(fadeLayerBySector({ year: undefined })(MOCK_CHART)).toBeNull();
    });
  });

  /**
   * Page Scenarios
   */
  describe('Test in page scenarios', () => {
    const wrapper = mount(<svg>{fadeLayerScenario(MOCK_YEAR)(MOCK_CHART)}</svg>);

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
      expect(wrapper.findWhere(node => node.type() === 'g' && node.prop('opacity') === 0.7).exists()).toBeTruthy();

      // verify linear gradients
      const gradients = wrapper.findWhere(node => node.type() === 'linearGradient').map(node => node.prop('id'));
      expect(gradients.sort()).toEqual(MOCK_CHART.series.map(line => `line-${line.id}-gradient`).sort());
    });
  });

  /**
   * Transportation
   */
  describe('Test sector transportation', () => {
    const wrapper = mount(
      <svg>{fadeLayerBySector({ ...MOCK_YEAR, isTransportation: true })(MOCK_CHART)}</svg>,
    );

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
      expect(wrapper.findWhere(node => node.type() === 'g' && node.prop('opacity') === 0.7).exists()).toBeTruthy();

      // verify linear gradients
      const gradients = wrapper.findWhere(node => node.type() === 'linearGradient').map(node => node.prop('id'));
      expect(gradients.sort()).toEqual(MOCK_CHART.series.map(line => `line-${line.id}-gradient`).sort());
    });
  });
});
