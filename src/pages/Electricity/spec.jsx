import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Tooltip, Typography, Paper } from '@material-ui/core';

import Electricity from '.';
import { TestContainer, getRendered } from '../../tests/utilities';
import YearSlider from '../../components/YearSlider';
import { DEFAULT_CONFIG, MOCK_DATA_REGION, MOCK_DATA_SINGLE, MOCK_DATA_SOURCE, MOCK_YEAR } from './stories';
import VizTooltip from '../../components/VizTooltip';

const SOURCE_TO_TEXT = {
  HYDRO: 'Hydro / Wave / Tidal',
  NUCLEAR: 'Nuclear',
  COAL: 'Coal & Coke',
};

const getComponent = (data, props, desktop) => {
  global.matchMedia = media => ({
    addListener: () => {},
    removeListener: () => {},
    matches: desktop && media === '(min-width: 992px)',
  });
  return (
    <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
      <Electricity data={data} year={MOCK_YEAR} />
    </TestContainer>
  );
};

const locateText = text => node => node.type() === Typography && node.text() === text;

describe('Page|Electricity', () => {
  let wrapper;

  /**
   * View by region
   */
  describe('Test view by region', () => {
    beforeEach(async () => {
      wrapper = mount(getComponent(MOCK_DATA_REGION, { baseYear: 2005 }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(getRendered(Electricity, wrapper).exists()).toBeTruthy();
    });

    test('should render viz properties', async () => {
      await act(async () => {
        wrapper.find(Tooltip).at(0).prop('onOpen')();
        wrapper.find(YearSlider).prop('onYearChange')(2006);
      });

      // verify each bubble group
      Object.keys(MOCK_DATA_REGION[2005]).forEach((region) => {
        // use the region label to locate the bubble
        const regionLabel = wrapper
          .findWhere(node => node.type() === Paper && node.text() === region);
        expect(regionLabel.exists()).toBeTruthy();

        // num of bubble nodes + region label
        expect(regionLabel.closest('div').children()).toHaveLength(MOCK_DATA_REGION[2005][region].length + 1);

        // region label text
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
      wrapper = mount(getComponent(MOCK_DATA_SOURCE, { view: 'source' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(getRendered(Electricity, wrapper).exists()).toBeTruthy();
    });

    test('should render viz properties', async () => {
      // verify each bubble group
      Object.keys(MOCK_DATA_SOURCE[2005]).forEach((source) => {
        // use the region label to locate the bubble
        const sourceLabel = wrapper
          .findWhere(node => node.type() === Paper && node.text() === SOURCE_TO_TEXT[source]);
        expect(sourceLabel.exists()).toBeTruthy();

        // num of bubble nodes + source label
        expect(sourceLabel.closest('div').children()).toHaveLength(MOCK_DATA_SOURCE[2005][source].length + 1);
      });

      // annotation
      expect(wrapper.findWhere(locateText('AMOUNT BY REGION')).exists()).toBeTruthy();
      expect(wrapper.findWhere(locateText('TOTAL AMOUNT')).exists()).toBeTruthy();
    });
  });

  /**
   * data === null
   */
  describe('Test with invalid data structure', () => {
    test('should NOT render component', async () => {
      wrapper = mount(getComponent(null));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();

        expect(getRendered(Electricity, wrapper).exists()).toBeFalsy();
      });
    });
  });

  /**
   * Responsiveness / single bubble group
   */
  describe('Test responsiveness and single bubble', () => {
    test('should render in tablet mode', async () => {
      wrapper = mount(getComponent(MOCK_DATA_SINGLE));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });

      // should render
      expect(getRendered(Electricity, wrapper).exists()).toBeTruthy();

      // verify legend location
      expect(wrapper.find(VizTooltip)).toHaveLength(1);
      expect(wrapper.find(VizTooltip).parent().prop('style').right).toEqual('calc(-100% - 200px)');
    });

    test('should render in desktop mode', async () => {
      wrapper = mount(getComponent(MOCK_DATA_SINGLE, {}, true));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });

      // should render
      expect(getRendered(Electricity, wrapper).exists()).toBeTruthy();

      // verify legend location
      expect(wrapper.find(VizTooltip)).toHaveLength(1);
      expect(wrapper.find(VizTooltip).parent().prop('style').right).toEqual('calc(-100% - 100px)');
    });
  });
});
