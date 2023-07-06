import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ResponsiveLine } from '@nivo/line';

import Scenarios, { dottedLayer } from '.';
import { TestContainer, getRendered } from '../../tests/utilities';
import { DEFAULT_CONFIG, MOCK_DATA } from './stories';
import YearSliceTooltip from '../../components/YearSliceTooltip';
import UnavailableDataMessage from '../../components/UnavailableDataMessage';

const getComponent = props => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
    <Scenarios />
  </TestContainer>
);

describe('Page|Scenarios', () => {
  let wrapper;

  /**
   * data !== null
   */
  describe('Test with valid data structure', () => {
    beforeEach(async () => {
      const dom = mount(getComponent());
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
      })).toHaveProperty('type', YearSliceTooltip);
    });
  });

  /**
   * data === null
   */
  describe('Test with invalid data structure', () => {
    test('should render UnavailableDataMessage component', async () => {
      const dom = mount(getComponent({ mainSelection: null }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();

        expect(getRendered(UnavailableDataMessage, dom).exists());
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
