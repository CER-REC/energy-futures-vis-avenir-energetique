import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Typography, Link } from '@material-ui/core';

import PageLayout from '.';
import analytics from '../../analytics';
import { TestContainer, getRendered } from '../../tests/utilities';
import YearSelect from '../YearSelect';
import { DownloadButton, Share } from '../Share';
import { PageSelect, PageTitle } from '../PageSelect';
import ScenarioSelect from '../ScenarioSelect';
import HorizontalControlBar from '../HorizontalControlBar';
import DraggableVerticalList from '../DraggableVerticalList';
import LinkButtonGroup from '../LinkButtonGroup';

const DEFAULT_CONFIG = {
  page: 'by-sector',
  mainSelection: 'energyDemand',
  yearId: '2020',
  scenarios: ['Evolving'],
  sector: 'ALL',
  view: 'region',
  unit: 'petajoules',
  provinces: ['ALL'],
  provinceOrder: ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'],
  sources: ['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL'],
  sourceOrder: ['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL'],
};

const spyAnalytics = jest.spyOn(analytics, 'reportNav');

const getComponentWithNoVerticalList = (props, desktop) => {
  global.matchMedia = media => ({
    addListener: () => {},
    removeListener: () => {},
    matches: desktop && media === '(min-width: 992px)',
  });
  return (
    <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
      <PageLayout />
    </TestContainer>
  );
};

const getComponentWithVerticalList = props => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
    <PageLayout showRegion showSource />
  </TestContainer>
);

describe('Component|PageLayout', () => {
  let wrapper;

  /**
   * Basic page layout with no vertical lists
   */
  describe('Test basic page layout with no vertical lists', () => {
    beforeEach(async () => {
      wrapper = mount(getComponentWithNoVerticalList({ page: 'scenarios' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
      expect(wrapper.find(DraggableVerticalList).length).toBe(0);
    });
  });

  /**
   * Basic page layout with 2 vertical lists
   */
  describe('Test basic page layout with 2 vertical lists', () => {
    beforeEach(async () => {
      wrapper = mount(getComponentWithVerticalList());
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(getRendered(PageLayout, wrapper).type()).not.toBeNull();
    });

    test('should render child components', async () => {
      expect(wrapper.findWhere(node => node.type() === Typography && node.text() === 'Exploring Canada’s Energy Future').exists()).toBeTruthy();
      expect(wrapper.find(YearSelect).exists()).toBeTruthy();
      expect(wrapper.find(DownloadButton).exists()).toBeTruthy();
      expect(wrapper.find(PageTitle).exists()).toBeTruthy();
      expect(wrapper.find(ScenarioSelect).exists()).toBeTruthy();
      expect(wrapper.find(HorizontalControlBar).exists()).toBeTruthy();
      expect(wrapper.find(Share).exists()).toBeTruthy();
      expect(wrapper.find(PageSelect).exists()).toBeTruthy();

      // should render 2 vertical lists
      expect(wrapper.find(DraggableVerticalList).length).toBe(2);

      // verify the headerlink has been triggered
      await act(async () => {
        wrapper.find(Link).at(0).simulate('click');
        expect(spyAnalytics).toBeCalled();
      });
    });
  });

  /**
   * Base year exceed range
   */
  describe('Test invalid base year value', () => {
    beforeEach(async () => {
      wrapper = mount(getComponentWithNoVerticalList({ baseYear: 2077 }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should NOT render component', () => {
      expect(getRendered(PageLayout, wrapper).exists()).toBeFalsy();
    });
  });

  /**
   * Compare year exceed range
   */
  describe('Test invalid compare year value', () => {
    beforeEach(async () => {
      wrapper = mount(getComponentWithNoVerticalList({ compareYear: 2077 }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should NOT render component', () => {
      expect(getRendered(PageLayout, wrapper).exists()).toBeFalsy();
    });
  });

  /**
   * Basic page layout with responsiveness
   */
  describe('Test responsiveness', () => {
    test('should render in tablet mode', async () => {
      wrapper = mount(getComponentWithNoVerticalList());
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });

      // should render
      expect(getRendered(PageLayout, wrapper).type()).not.toBeNull();

      // verify the shape of different components
      expect(wrapper.find(PageSelect).prop('direction')).toBe('row');
      expect(wrapper.find(LinkButtonGroup).prop('direction')).toBe('row');
      expect(wrapper.find(Share).prop('direction')).toBe('row');
    });

    test('should render in desktop mode', async () => {
      wrapper = mount(getComponentWithNoVerticalList({}, true));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });

      // should render
      expect(getRendered(PageLayout, wrapper).type()).not.toBeNull();

      // verify the shape of different components
      expect(wrapper.find(PageSelect).prop('direction')).toBe('column');
      expect(wrapper.find(LinkButtonGroup).prop('direction')).toBe('column');
      expect(wrapper.find(Share).prop('direction')).toBe('column');
    });
  });
});
