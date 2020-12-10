import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ResponsiveLine } from '@nivo/line';

import BySector from '.';
import { TestContainer, getRendered } from '../../tests/utilities';
import VizTooltip from '../../components/VizTooltip';
import MaxTick from '../../components/MaxTick';
import { DEFAULT_CONFIG, BASE_DATA, GENERATE_DATA } from './stories';

const MOCK_DATA = [
  { id: 'BIO', data: GENERATE_DATA('BIO'), color: BASE_DATA.BIO.color },
  { id: 'ELECTRICITY', data: GENERATE_DATA('ELECTRICITY'), color: BASE_DATA.ELECTRICITY.color },
  { id: 'GAS', data: GENERATE_DATA('GAS'), color: BASE_DATA.GAS.color },
  { id: 'OIL', data: GENERATE_DATA('OIL'), color: BASE_DATA.OIL.color },
  { id: 'AVIATION', data: GENERATE_DATA('AVIATION'), color: BASE_DATA.AVIATION.color },
  { id: 'DIESEL', data: GENERATE_DATA('DIESEL'), color: BASE_DATA.DIESEL.color },
  { id: 'GASOLINE', data: GENERATE_DATA('GASOLINE'), color: BASE_DATA.GASOLINE.color },
];

const getComponent = (data, year) => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG }}>
    <BySector data={data} year={year} />
  </TestContainer>
);

describe('Page|BySector', () => {
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
        wrapper = getRendered(BySector, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render viz properties', () => {
      MOCK_DATA.forEach((source) => {
        expect(wrapper.find(ResponsiveLine).prop('colors')({ id: source.id })).toEqual(source.color);
      });

      expect(wrapper.find(ResponsiveLine).prop('sliceTooltip')({
        points: [115, 152, 184, 220, 269, 461, 590]
          .map((y, i) => ({ serieId: MOCK_DATA[i].id, serieColor: MOCK_DATA[i].color, y })),
      })).toHaveProperty('type', VizTooltip);

      expect(wrapper.find(ResponsiveLine).prop('axisBottom').format(2005)).toEqual(2005);
      expect(wrapper.find(ResponsiveLine).prop('axisBottom').format(2008)).toEqual('');
      expect(wrapper.find(ResponsiveLine).prop('axisRight').format(500)).toEqual(500);
      expect(wrapper.find(ResponsiveLine).prop('axisRight').format(2470)).toHaveProperty('type', MaxTick);
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

        expect(getRendered(BySector, dom).exists()).toBeFalsy();
      });
    });
  });
});
