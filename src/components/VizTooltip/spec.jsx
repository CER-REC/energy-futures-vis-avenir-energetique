import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Paper } from '@material-ui/core';
import VizTooltip from '.';
import { TestContainer, getRendered } from '../../tests/utilities';

const MOCK_NODES = [
  { name: 'COAL', value: 43581.072, color: '#4B5E5B', translation: 'Coal & Coke' },
  { name: 'GAS', value: 19568.76, color: '#890038', translation: 'Natural Gas' },
  { name: 'HYDRO', value: 2316, color: '#5FBEE6', translation: 'Hydro / Wave / Tidal' },
  { name: 'BIO', value: 1725.168, color: '#1C7F24', translation: 'Biomass / Geothermal' },
  { name: 'RENEWABLE', value: 741, color: '#FFCC47', translation: 'Solar / Wind' },
  { name: 'OIL', value: 509.4367, color: '#FF821E', translation: 'Oil' },
];

const MOCK_LABELS = [
  'Coal & Coke:',
  'Natural Gas:',
  'Hydro / Wave / Tidal:',
  'Biomass / Geothermal:',
  'Solar / Wind:',
  'Oil:',
  'All:',
];

const getComponent = props => (
  <TestContainer>
    <VizTooltip nodes={MOCK_NODES} unit="kilobarrelEquivalents" {...props} />
  </TestContainer>
);

describe('Component|VizTooltip', () => {
  /**
   * Stand-alone
   */
  describe('Test stand-alone component', () => {
    const dom = mount(getComponent());

    test('should render component', async () => {
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        const wrapper = getRendered(VizTooltip, dom);

        expect(wrapper.type()).not.toBeNull();
        expect(wrapper.find('strong').map(label => label.text())).toEqual(MOCK_LABELS);
      });
    });
  });

  /**
   * In tooltip panel
   */
  describe('Test component renders in Paper', () => {
    const dom = mount(getComponent({ paper: true }));

    test('should render component', async () => {
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        const wrapper = getRendered(VizTooltip, dom);

        expect(wrapper.type()).not.toBeNull();
        expect(wrapper.find(Paper).exists()).toBeTruthy();
        expect(wrapper.find('strong').map(label => label.text())).toEqual(MOCK_LABELS);
      });
    });
  });
});
