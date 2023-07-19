import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Typography, Paper } from '@material-ui/core';

import Electricity from '.';
import { TestContainer, getRendered } from '../../tests/utilities';
import DEFAULT_CONFIG from './stories';
import YearSliceTooltip from '../../components/YearSliceTooltip';
import UnavailableDataMessage from '../../components/UnavailableDataMessage';

const SOURCE_TO_TEXT = {
  HYDRO: 'Hydro / Wave / Tidal',
  NUCLEAR: 'Nuclear',
  COAL: 'Coal & Coke',
};

const MOCK_DATA_REGION = Array(46).fill(undefined).map((_, i) => i).reduce((data, year) => ({
  ...data,
  [2005 + year]: {
    ON: [
      { name: 'COAL', value: 28734.08 },
      { name: 'HYDRO', value: 2316 },
      { name: 'NUCLEAR', value: 35480 },
    ].map(type => ({ ...type, value: type.value * (1 + Math.random() / 5) })),
    NB: [
      { name: 'HYDRO', value: 3875 },
      { name: 'COAL', value: 43581.072 },
      { name: 'NUCLEAR', value: 13157.72 },
    ].map(type => ({ ...type, value: type.value * (1 + Math.random() / 5) })),
  },
}), {});

const MOCK_DATA_SOURCE = Array(46).fill(undefined).map((_, i) => i).reduce((data, year) => ({
  ...data,
  [2005 + year]: {
    HYDRO: [
      { name: 'ON', value: 2316 },
      { name: 'NB', value: 3875 },
    ],
    NUCLEAR: [
      { name: 'ON', value: 35480 },
      { name: 'NB', value: 13157.72 },
    ],
    COAL: [
      { name: 'ON', value: 28734.08 },
      { name: 'NB', value: 43581.072 },
    ],
  },
}), {});

const getComponent = (props, desktop) => {
  global.matchMedia = media => ({
    addListener: () => {},
    removeListener: () => {},
    matches: desktop && media === '(min-width: 992px)',
  });
  return (
    <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
      <Electricity />
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
      wrapper = mount(getComponent({ baseYear: 2005 }));
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
      wrapper = mount(getComponent({ view: 'source', baseYear: 2005 }));
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
    test('should render UnavailableDataMessage component', async () => {
      wrapper = mount(getComponent());
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();

        expect(getRendered(UnavailableDataMessage, wrapper).exists());
      });
    });
  });

  /**
   * Responsiveness / single bubble group
   */
  describe('Test responsiveness and single bubble', () => {
    test('should render in tablet mode', async () => {
      wrapper = mount(getComponent({ provinces: ['ON'], baseYear: 2005 }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });

      // should render
      expect(getRendered(Electricity, wrapper).exists()).toBeTruthy();

      // verify legend location
      expect(wrapper.find(YearSliceTooltip)).toHaveLength(1);
      expect(wrapper.find(YearSliceTooltip).parent().prop('style').right).toEqual('calc(-100% - 200px)');
    });

    test('should render in desktop mode', async () => {
      wrapper = mount(getComponent({ provinces: ['ON'], baseYear: 2005 }, true));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });

      // should render
      expect(getRendered(Electricity, wrapper).exists()).toBeTruthy();

      // verify legend location
      expect(wrapper.find(YearSliceTooltip)).toHaveLength(1);
      expect(wrapper.find(YearSliceTooltip).parent().prop('style').right).toEqual('calc(-100% - 100px)');
    });
  });
});
