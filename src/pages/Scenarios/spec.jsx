import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ResponsiveLine } from '@nivo/line';

import Scenarios, { dottedLayer } from '.';
import { TestContainer, getRendered } from '../../tests/utilities';
import DEFAULT_CONFIG from './stories';
import YearSliceTooltip from '../../components/YearSliceTooltip';
import UnavailableDataMessage from '../../components/UnavailableDataMessage';

const MOCK_DATA = [{
  id: 'Evolving',
  data: [
    { x: 2005, y: 10495.5881 },
    { x: 2006, y: 10483.1437 },
    { x: 2007, y: 10821.7113 },
    { x: 2008, y: 10612.4623 },
    { x: 2009, y: 10267.3791 },
    { x: 2010, y: 10548.0963 },
    { x: 2011, y: 10925.7427 },
    { x: 2012, y: 11084.4039 },
    { x: 2013, y: 11294.0164 },
    { x: 2014, y: 11366.9613 },
    { x: 2015, y: 11393.3692 },
    { x: 2016, y: 11267.4028 },
    { x: 2017, y: 11514.5233 },
    { x: 2018, y: 12152.4675 },
    { x: 2019, y: 12170.3384 },
    { x: 2020, y: 11364.7302 },
    { x: 2021, y: 11889.6772 },
    { x: 2022, y: 12014.4135 },
    { x: 2023, y: 11982.6789 },
    { x: 2024, y: 11939.0327 },
    { x: 2025, y: 11883.6812 },
    { x: 2026, y: 11855.761 },
    { x: 2027, y: 11802.3794 },
    { x: 2028, y: 11730.5698 },
    { x: 2029, y: 11639.0599 },
    { x: 2030, y: 11560.9228 },
    { x: 2031, y: 11513.7469 },
    { x: 2032, y: 11456.9712 },
    { x: 2033, y: 11367.4261 },
    { x: 2034, y: 11284.8618 },
    { x: 2035, y: 11211.9434 },
    { x: 2036, y: 11115.7014 },
    { x: 2037, y: 11015.1869 },
    { x: 2038, y: 10946.4178 },
    { x: 2039, y: 10897.1192 },
    { x: 2040, y: 10818.9825 },
    { x: 2041, y: 10730.0075 },
    { x: 2042, y: 10638.1076 },
    { x: 2043, y: 10551.2738 },
    { x: 2044, y: 10470.8445 },
    { x: 2045, y: 10383.5118 },
    { x: 2046, y: 10295.1017 },
    { x: 2047, y: 10209.1911 },
    { x: 2048, y: 10124.3517 },
    { x: 2049, y: 10043.8959 },
    { x: 2050, y: 9964.7608 },
  ],
}];

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
