import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Tooltip, Typography } from '@material-ui/core';

import Electricity from '.';
import { TestContainer, getRendered } from '../../tests/utilities';
import YearSlider from '../../components/YearSlider';
import { DEFAULT_CONFIG, MOCK_DATA_REGION, MOCK_DATA_SINGLE, MOCK_DATA_SOURCE, MOCK_YEAR } from './stories';

const getComponent = (data, props) => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
    <Electricity data={data} year={MOCK_YEAR} />
  </TestContainer>
);

const locateText = text => node => node.type() === Typography && node.text() === text;

describe('Page|Electricity', () => {
  let wrapper;

  /**
   * View by region
   */
  describe('Test view by region', () => {
    beforeEach(async () => {
      const dom = mount(getComponent({ 2005: MOCK_DATA_REGION }, { baseYear: 2005 }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(Electricity, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render viz properties', async () => {
      await act(async () => {
        wrapper.find(Tooltip).at(0).prop('onOpen')();
        wrapper.find(YearSlider).prop('onYearChange')(2006);
      });

      Object.keys(MOCK_DATA_REGION).forEach((region) => {
        // bubble group
        expect(wrapper.find(`#bubble-group-${region}`).exists()).toBeTruthy();

        // num of bubble nodes + region label
        expect(wrapper.find(`#bubble-group-${region}`).children()).toHaveLength(MOCK_DATA_REGION[region].length + 1);

        // region lable text
        expect(wrapper.findWhere(locateText(region)).exists()).toBeTruthy();
      });

      // annotation
      expect(wrapper.findWhere(locateText('AMOUNT BY SOURCE')).exists()).toBeTruthy();
      expect(wrapper.findWhere(locateText('TOTAL AMOUNT')).exists()).toBeTruthy();
    });
  });

  /**
   * View by source
   */
  describe('Test view by source', () => {
    beforeEach(async () => {
      const dom = mount(getComponent({ 2005: MOCK_DATA_SOURCE }, { view: 'source' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(Electricity, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render viz properties', async () => {
      Object.keys(MOCK_DATA_SOURCE).forEach((source) => {
        // bubble group
        expect(wrapper.find(`#bubble-group-${source}`).exists()).toBeTruthy();

        // num of bubble nodes + source label
        expect(wrapper.find(`#bubble-group-${source}`).children()).toHaveLength(MOCK_DATA_SOURCE[source].length + 1);
      });

      // annotation
      expect(wrapper.findWhere(locateText('AMOUNT BY REGION')).exists()).toBeTruthy();
      expect(wrapper.findWhere(locateText('TOTAL AMOUNT')).exists()).toBeTruthy();
    });
  });

  /**
   * Single bubble chart
   */
  describe('Test single bubble chart', () => {
    beforeEach(async () => {
      const dom = mount(getComponent({ 2005: MOCK_DATA_SINGLE }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(Electricity, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
      expect(wrapper.find('#single-bubble-legend').exists()).toBeTruthy();
    });
  });

  /**
   * data === null
   */
  describe('Test with invalid data structure', () => {
    test('should NOT render component', async () => {
      const dom = mount(getComponent(null));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();

        expect(getRendered(Electricity, dom).exists()).toBeFalsy();
      });
    });
  });
});
