import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { TableRow, Button, Tooltip, Typography } from '@material-ui/core';

import OilAndGas from '.';
import { TestContainer, getRendered } from '../../tests/utilities';
import { DEFAULT_CONFIG, MOCK_DATA_REGION, MOCK_DATA_SOURCE } from './stories';
import UnavailableDataMessage from '../../components/UnavailableDataMessage';

const getComponent = (props, width = 900) => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
    <OilAndGas
      vizDimension={{ height: 800, width }}
    />
  </TestContainer>
);

describe('Page|OilAndGas', () => {
  let wrapper;

  /**
   * View by region
   */
  describe('Test view by region', () => {
    beforeEach(async () => {
      wrapper = mount(getComponent());
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(getRendered(OilAndGas, wrapper).exists()).toBeTruthy();
    });

    test('should render viz properties', async () => {
      // verify the total number of treemaps and test color
      const numOfNoneZeroRegions = [
        ...MOCK_DATA_REGION[2005],
        ...MOCK_DATA_REGION[2006],
      ].filter(region => region.total > 0).length;
      expect(wrapper.find(ResponsiveTreeMap)).toHaveLength(numOfNoneZeroRegions);
      expect(wrapper.find(ResponsiveTreeMap).at(0).prop('colors')({ name: 'CONDENSATE' })).toEqual('#9B938A');

      // 3 rows
      expect(wrapper.find(TableRow)).toHaveLength(3);

      // year labels
      expect(wrapper.findWhere(node => node.type() === Typography && node.text() === '2005').exists()).toBeTruthy();
      expect(wrapper.findWhere(node => node.type() === Typography && node.text() === '2006').exists()).toBeTruthy();

      // legend
      expect(wrapper.findWhere(node => node.type() === Typography && node.text() === 'Region : % Oil Production in Canada').exists()).toBeTruthy();

      // compare button
      expect(wrapper.find(Button).text()).toEqual('Don\'t Compare');
      expect(wrapper.find(Button).prop('onClick')()).not.toBeNull();

      // open the first tooltip and verify it is visible
      await act(async () => {
        expect(wrapper.find(Tooltip).at(0).prop('open')).toBeFalsy();
        wrapper.find(Tooltip).at(0).prop('onOpen')();
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(wrapper.find(Tooltip).at(0).prop('open')).toBeTruthy();
      });

      // close the first tooltip and verify it is no longer visible
      await act(async () => {
        expect(wrapper.find(Tooltip).at(0).prop('open')).toBeTruthy();
        wrapper.find(Tooltip).at(0).prop('onClose')();
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(wrapper.find(Tooltip).at(0).prop('open')).toBeFalsy();
      });
    });
  });

  /**
   * View by source
   */
  describe('Test view by source', () => {
    beforeEach(async () => {
      wrapper = mount(getComponent({ view: 'source' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(getRendered(OilAndGas, wrapper).exists()).toBeTruthy();
    });

    test('should render treemaps', async () => {
      // verify the total number of treemaps and test color
      const numOfNoneZeroSources = [
        ...MOCK_DATA_SOURCE[2005],
        ...MOCK_DATA_SOURCE[2006],
      ].filter(region => region.total > 0).length;
      expect(wrapper.find(ResponsiveTreeMap)).toHaveLength(numOfNoneZeroSources);
      expect(wrapper.find(ResponsiveTreeMap).at(0).prop('colors')({ name: 'AB' })).toEqual('#054169');

      // legend
      expect(wrapper.findWhere(node => node.type() === Typography && node.text() === 'Oil Type').exists()).toBeTruthy();
    });
  });

  /**
   * No compare
   */
  describe('Test no compare', () => {
    beforeEach(async () => {
      wrapper = mount(getComponent({ view: 'region', noCompare: true }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(getRendered(OilAndGas, wrapper).exists()).toBeTruthy();
    });

    test('should render button', async () => {
      expect(wrapper.find(Button).text()).toEqual('Compare');

      // year label; only the current year
      expect(wrapper.findWhere(node => node.type() === Typography && node.text() === '2005').exists()).toBeTruthy();
      expect(wrapper.findWhere(node => node.type() === Typography && node.text() === '2006').exists()).toBeFalsy();
    });
  });

  /**
   * 0 width canvas
   */
  describe('Test with invalid canvas size', () => {
    test('should NOT render component', async () => {
      wrapper = mount(getComponent({ view: 'region' }, 0));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();

        expect(getRendered(OilAndGas, wrapper).exists()).toBeTruthy();
      });
    });
  });

  /**
   * corrupted data
   */
  describe('Test with invalid data structure', () => {
    test('should render UnavailableDataMessage component', async () => {
      wrapper = mount(getComponent({ provinces: ['AB'] }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();

        expect(getRendered(UnavailableDataMessage, wrapper).exists());
      });
    });
  });
});
