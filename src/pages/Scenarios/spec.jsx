import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ResponsiveLine } from '@nivo/line';

import Scenarios, { dottedLayer } from '.';
import { TestContainer, getRendered } from '../../tests/utilities';
import VizTooltip from '../../components/VizTooltip';
import MaxTick from '../../components/MaxTick';
import { DEFAULT_CONFIG, MOCK_DATA } from './stories';

const getComponent = (data, year) => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG }}>
    <Scenarios data={data} year={year} />
  </TestContainer>
);

describe('Page|Scenarios', () => {
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
        wrapper = getRendered(Scenarios, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render viz properties', () => {
      expect(wrapper.find(ResponsiveLine).prop('colors')({ id: 'Evolving' })).toEqual('#6D60E8');

      expect(wrapper.find(ResponsiveLine).prop('sliceTooltip')({
        slice: {
          points: [{
            id: 'Evolving.30',
            serieId: 'Evolving',
            serieColor: '#6D60E8',
            y: 80,
          }],
        },
      })).toHaveProperty('type', VizTooltip);

      expect(wrapper.find(ResponsiveLine).prop('axisBottom').format(2005)).toEqual(2005);
      expect(wrapper.find(ResponsiveLine).prop('axisBottom').format(2008)).toEqual('');

      expect(wrapper.find(ResponsiveLine).prop('axisRight').format(10925.7427)).toEqual(10925.7427);
      expect(wrapper.find(ResponsiveLine).prop('axisRight').format(12171)).toHaveProperty('type', MaxTick);
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

        expect(getRendered(Scenarios, dom).exists()).toBeFalsy();
      });
    });
  });

  /**
   * dottedLayer
   */
  describe('Test dottedLayer', () => {
    const MOCK_CIRCLES = {
      points: MOCK_DATA[0].data.map((data, index) => ({
        borderColor: '#6D60E8',
        color: 'transparent',
        data: { x: data.x, xFormatted: data.x, y: data.y, yFormatted: data.y },
        id: `Evolving.${index}`,
        index,
        serieColor: '#6D60E8',
        serieId: 'Evolving',
        x: 0,
        y: 83,
      })),
      pointSize: 8,
      pointBorderWidth: 2,
    };

    test('should render component', async () => {
      wrapper = mount(<svg>{dottedLayer('2020')(MOCK_CIRCLES)}</svg>);

      expect(wrapper.find('svg').exists()).toBeTruthy();
      expect(wrapper.find('circle')).toHaveLength(MOCK_DATA[0].data.length);
    });
  });
});
