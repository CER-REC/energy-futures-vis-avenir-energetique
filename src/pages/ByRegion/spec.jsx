import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ResponsiveBar } from '@nivo/bar';

import ByRegion from '.';
import { TestContainer, getRendered } from '../../tests/utilities';
import { BASE_DATA, DEFAULT_CONFIG } from './stories';
import YearSliceTooltip from '../../components/YearSliceTooltip';
import UnavailableDataMessage from '../../components/UnavailableDataMessage';

const MOCK_DATA = [
  { year: '2005', ...BASE_DATA },
  { year: '2050', ...BASE_DATA },
];

const getComponent = (props) => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
    <ByRegion />
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
      expect(wrapper.find(ResponsiveBar).prop('tooltip')({
        data: {
          color: 'rgba(255, 130, 30, 1)',
          id: 'ON',
          indexValue: '2005',
          value: 3045.0494,
        },
      })).toHaveProperty('type', YearSliceTooltip);
    });
  });

  /**
   * data === null
   */
  describe('Test with no data', () => {
    test('should render UnavailableDataMessage component', async () => {
      const dom = mount(getComponent({ provinces: ['AB'] }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();

        expect(getRendered(UnavailableDataMessage, dom).exists());
      });
    });
  });
});
