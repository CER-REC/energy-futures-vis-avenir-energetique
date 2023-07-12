import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { TableRow, Button, Tooltip, Typography } from '@material-ui/core';

import OilAndGas from '.';
import { TestContainer, getRendered } from '../../tests/utilities';
import DEFAULT_CONFIG from './stories';
import UnavailableDataMessage from '../../components/UnavailableDataMessage';

const MOCK_DATA_REGION = Array(46).fill(undefined).map((_, i) => i).reduce((data, year) => ({
  ...data,
  [2005 + year]: [
    {
      name: 'SK',
      total: 419.58930505821843,
      children: [
        { name: 'HEAVY', value: 418.4023886611925 },
        { name: 'LIGHT', value: 0.60691737169272 },
        { name: 'C5', value: 0.5799990253332 },
      ],
    },
    { name: 'NL', total: 304.866606, children: [{ name: 'LIGHT', value: 304.866606 }] },
    {
      name: 'BC',
      total: year % 2 ? 41.646612236203914 : 0,
      children: year % 2 ? [
        { name: 'LIGHT', value: 29.216633124950697 },
        { name: 'C5', value: 7.592780817207959 },
        { name: 'CONDENSATE', value: 4.837198294045259 },
      ] : [],
    },
    { name: 'NT', total: 18.806502000000002, children: [{ name: 'LIGHT', value: 18.806502000000002 }] },
    { name: 'MB', total: 13.85948082225036, children: [{ name: 'LIGHT', value: 13.85948082225036 }] },
    {
      name: 'NS',
      total: year % 2 ? 12.9199782884568 : 0,
      children: year % 2 ? [{ name: 'C5', value: 12.9199782884568 }] : [],
    },
    {
      name: 'ON',
      total: year % 2 ? 2.3901239999999997 : 0,
      children: year % 2 ? [{ name: 'LIGHT', value: 2.3901239999999997 }] : [],
    },
    { name: 'PE', total: 18.806502000000002, children: [{ name: 'LIGHT', value: 18.806502000000002 }] },
    {
      name: 'NB',
      total: year % 2 ? 2.3901239999999997 : 0,
      children: year % 2 ? [{ name: 'LIGHT', value: 2.3901239999999997 }] : [],
    },
    { name: 'QC', total: 0, children: [] },
    { name: 'YT', total: 0, children: [] },
    { name: 'NU', total: 0, children: [] },
  ],
}), {});

const MOCK_DATA_SOURCE = Array(46).fill(undefined).map((_, i) => i).reduce((data, year) => ({
  ...data,
  [2005 + year]: [
    {
      name: 'LIGHT',
      total: 757.2538331092594,
      children: [
        { name: 'NL', value: 304.866606 },
        { name: 'BC', value: 29.216633124950697 },
        { name: 'NT', value: 18.806502000000002 },
        { name: 'MB', value: 13.85948082225036 },
        { name: 'ON', value: 2.3901239999999997 },
        { name: 'SK', value: 0.60691737169272 },
      ],
    },
    {
      name: 'HEAVY',
      total: 602.0242550255709,
      children: [
        { name: 'SK', value: 418.4023886611925 },
      ],
    },
    {
      name: 'C5',
      total: 120.00328881521773,
      children: [
        { name: 'NS', value: 12.9199782884568 },
        { name: 'BC', value: 7.592780817207959 },
        { name: 'SK', value: 0.5799990253332 },
      ],
    },
    {
      name: 'CONDENSATE',
      total: 44.986433924428916,
      children: [
        { name: 'BC', value: 4.837198294045259 },
      ],
    },
  ],
}), {});

const getComponent = props => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
    <OilAndGas />
  </TestContainer>
);

describe('Page|OilAndGas', () => {
  let wrapper;
  Element.prototype.getBoundingClientRect = jest.fn(() => ({
    width: 900,
    height: 120,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }));

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
      wrapper = mount(getComponent({ view: 'region' }));
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
