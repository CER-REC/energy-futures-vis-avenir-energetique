import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { IconButton, Slider } from '@material-ui/core';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

import YearSlider from '.';
import { TestContainer, getRendered } from '../../tests/utilities';

const DEFAULT_CONFIG = {
  page: 'electricity',
  mainSelection: 'energyDemand',
  yearId: '2020',
  scenarios: ['Evolving'],
  view: 'region',
  baseYear: 2020,
  compareYear: 2020,
};

const getComponent = (year, min, max, forecast) => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG }}>
    <YearSlider year={year} min={min || 2005} max={max || 2050} forecast={forecast} />
  </TestContainer>
);

describe('Component|YearSlider', () => {
  let wrapper;

  /**
   * Base year only
   */
  describe('Test base year only', () => {
    beforeEach(async () => {
      wrapper = mount(getComponent(2020, 2005, 2050, 2018));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(getRendered(YearSlider, wrapper).type()).not.toBeNull();
    });

    test('should render year thumb', () => {
      expect(wrapper.findWhere(node => node.hasClass('MuiSlider-thumb') && node.text() === '2020').exists()).toBeTruthy();
    });

    test('should render play button', async () => {
      await act(async () => {
        // verify button icons
        expect(wrapper.find(IconButton).find(PlayIcon).exists()).toBeTruthy();
        expect(wrapper.find(IconButton).find(PauseIcon).exists()).toBeFalsy();
        wrapper.find(IconButton).at(0).prop('onClick')();
        await new Promise(resolve => setTimeout(resolve, 750));
        wrapper.update();
        expect(wrapper.find(IconButton).find(PlayIcon).exists()).toBeFalsy();
        expect(wrapper.find(IconButton).find(PauseIcon).exists()).toBeTruthy();

        // verify auto-play
        expect(Number(wrapper.find('.MuiSlider-thumb').at(0).text())).toBeGreaterThan(2020);
      });
    });
  });

  /**
   * Base year and compare year
   */
  describe('Test both base and compare years', () => {
    beforeEach(async () => {
      wrapper = mount(getComponent({ curr: 2020, compare: 2030 }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(getRendered(YearSlider, wrapper).type()).not.toBeNull();
    });

    test('should render year thumb', async () => {
      await act(async () => {
        expect(wrapper.find('.MuiSlider-thumb').map(node => node.text())).toEqual(['2030', '2020']);

        wrapper.find(Slider).at(0).prop('onChange')({}, 0);
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(wrapper.find('.MuiSlider-thumb').map(node => node.text())).toEqual(['2030', '2020']);

        wrapper.find(Slider).at(1).prop('onChange')({}, 0);
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(wrapper.find('.MuiSlider-thumb').map(node => node.text())).toEqual(['2030', '2020']);

        wrapper.find(Slider).at(0).prop('onChange')({}, 2045);
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(wrapper.find('.MuiSlider-thumb').map(node => node.text())).toEqual(['2045', '2020']);

        wrapper.find(Slider).at(1).prop('onChange')({}, 2045);
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(wrapper.find('.MuiSlider-thumb').map(node => node.text())).toEqual(['2045', '2045']);
      });
    });
  });

  /**
   * Invalid year value
   */
  describe('Test without a valid year value', () => {
    test('should NOT render component', async () => {
      wrapper = mount(getComponent(0));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();

        expect(getRendered(YearSlider, wrapper).exists()).toBeFalsy();
      });
    });
  });
});
