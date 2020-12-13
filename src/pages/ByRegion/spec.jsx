import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ResponsiveBar } from '@nivo/bar';

import ByRegion from '.';
import { TestContainer, getRendered } from '../../tests/utilities';
import VizTooltip from '../../components/VizTooltip';
import MaxTick from '../../components/MaxTick';
import { BASE_DATA, DEFAULT_CONFIG } from './stories';

const MOCK_DATA = [
  { year: '2005', ...BASE_DATA },
  { year: '2050', ...BASE_DATA },
];

const getComponent = (data, year) => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG }}>
    <ByRegion data={data} year={year} />
  </TestContainer>
);

describe('Page|ByRegion', () => {
  let wrapper;

  /**
   * data !== null
   */
  describe('Test with valid data structure', () => {
    beforeEach(async () => {
      const dom = mount(getComponent(MOCK_DATA, { min: 2005, max: 2050, forecastStart: 2020 }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(ByRegion, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render viz properties', () => {
      expect(wrapper.find(ResponsiveBar).prop('colors')({ id: 'ON', indexValue: '2005' })).toEqual('rgba(255, 130, 30, 1)');
      expect(wrapper.find(ResponsiveBar).prop('colors')({ id: 'ON', indexValue: '2053' })).toEqual('rgba(255, 130, 30, 0)');
      expect(wrapper.find(ResponsiveBar).prop('tooltip')({
        color: 'rgba(255, 130, 30, 1)',
        id: 'ON',
        indexValue: '2005',
        value: 3045.0494,
      })).toHaveProperty('type', VizTooltip);

      expect(wrapper.find(ResponsiveBar).prop('axisBottom').format(2005)).toEqual(2005);
      expect(wrapper.find(ResponsiveBar).prop('axisBottom').format(2008)).toEqual('');
      expect(wrapper.find(ResponsiveBar).prop('axisRight').format(3045.0494)).toEqual(3045.0494);
      expect(wrapper.find(ResponsiveBar).prop('axisRight').format(10496)).toHaveProperty('type', MaxTick);
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

        expect(getRendered(ByRegion, dom).exists()).toBeFalsy();
      });
    });
  });
});
