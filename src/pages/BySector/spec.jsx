import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ResponsiveLine } from '@nivo/line';

import BySector from '.';
import { TestContainer, getRendered } from '../../tests/utilities';
import DEFAULT_CONFIG from './stories';
import YearSliceTooltip from '../../components/YearSliceTooltip';
import UnavailableDataMessage from '../../components/UnavailableDataMessage';

const BASE_DATA = {
  BIO: { value: 11.08, color: '#1C7F24' },
  ELECTRICITY: { value: 3.53, color: '#7ACBCB' },
  GAS: { value: 1.88, color: '#890038' },
  OIL: { value: 98.16, color: '#FF821E' },
  AVIATION: { value: 254.33, color: '#FF821E' },
  DIESEL: { value: 745.31, color: '#FF821E' },
  GASOLINE: { value: 1355.29, color: '#FF821E' },
};

const GENERATE_DATA = (id, randomness /* boolean */) => Array(46)
  .fill(undefined)
  .map((_, i) => ({
    x: `${2005 + i}`,
    y: (BASE_DATA[id]?.value || 0) * (1 + (randomness ? (Math.random() / 5) : 0)),
  }));

const MOCK_DATA = [
  { id: 'BIO', data: GENERATE_DATA('BIO'), color: BASE_DATA.BIO.color },
  { id: 'ELECTRICITY', data: GENERATE_DATA('ELECTRICITY'), color: BASE_DATA.ELECTRICITY.color },
  { id: 'GAS', data: GENERATE_DATA('GAS'), color: BASE_DATA.GAS.color },
  { id: 'OIL', data: GENERATE_DATA('OIL'), color: BASE_DATA.OIL.color },
  { id: 'AVIATION', data: GENERATE_DATA('AVIATION'), color: BASE_DATA.AVIATION.color },
  { id: 'DIESEL', data: GENERATE_DATA('DIESEL'), color: BASE_DATA.DIESEL.color },
  { id: 'GASOLINE', data: GENERATE_DATA('GASOLINE'), color: BASE_DATA.GASOLINE.color },
];

const getComponent = props => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
    <BySector />
  </TestContainer>
);

describe('Page|BySector', () => {
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
        slice: {
          points: [115, 152, 184, 220, 269, 461, 590]
            .map((y, i) => ({ serieId: MOCK_DATA[i].id, serieColor: MOCK_DATA[i].color, y })),
        },
      })).toHaveProperty('type', YearSliceTooltip);
    });
  });

  /**
   * data === null
   */
  describe('Test with invalid data structure', () => {
    test('should render UnavailableDataMessage component', async () => {
      const dom = mount(getComponent({ sources: [] }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();

        expect(getRendered(UnavailableDataMessage, dom).exists());
      });
    });
  });
});
