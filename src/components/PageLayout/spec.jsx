import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Typography, Link } from '@material-ui/core';

import PageLayout from '.';
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

const getComponentWithNoVerticalList = props => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
    <PageLayout />
  </TestContainer>
);

const getComponentWithVerticalList = props => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
    <PageLayout showRegion showSource>{() => <Typography>Viz</Typography>}</PageLayout>
  </TestContainer>
);

describe('Component|PageLayout', () => {
  let wrapper;

  /**
   * Basic page layout with no vertical lists
   */
  describe('Test basic page layout with no vertical lists', () => {
    beforeEach(async () => {
      const dom = mount(getComponentWithNoVerticalList({ page: 'scenarios' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(PageLayout, dom);
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
      const dom = mount(getComponentWithVerticalList());
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(PageLayout, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render child components', () => {
      expect(wrapper.findWhere(node => node.type() === Typography && node.text() === 'Exploring Canada’s Energy Future')).not.toBeNull();
      expect(wrapper.findWhere(node => node.type() === Typography && node.text() === 'Viz')).not.toBeNull();
      expect(wrapper.find(YearSelect)).not.toBeNull();
      expect(wrapper.find(DownloadButton)).not.toBeNull();
      expect(wrapper.find(PageTitle)).not.toBeNull();
      expect(wrapper.find(ScenarioSelect)).not.toBeNull();
      expect(wrapper.find(HorizontalControlBar)).not.toBeNull();
      expect(wrapper.find(Share)).not.toBeNull();
      expect(wrapper.find(PageSelect)).not.toBeNull();

      // should render 2 vertical lists
      expect(wrapper.find(DraggableVerticalList).length).toBe(2);

      wrapper.find(Link).at(0).simulate('click');
    });
  });

  /**
   * Base year exceed range
   */
  describe('Test invalid base year value', () => {
    beforeEach(async () => {
      const dom = mount(getComponentWithNoVerticalList({ baseYear: 2077 }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(PageLayout, dom);
      });
    });

    test('should NOT render component', () => {
      expect(wrapper.exists()).toBeFalsy();
    });
  });

  /**
   * Compare year exceed range
   */
  describe('Test invalid compare year value', () => {
    beforeEach(async () => {
      const dom = mount(getComponentWithNoVerticalList({ compareYear: 2077 }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(PageLayout, dom);
      });
    });

    test('should NOT render component', () => {
      expect(wrapper.exists()).toBeFalsy();
    });
  });

  /**
   * Basic page layout with responsiveness
   */
  describe('Test responsiveness', () => {
    beforeEach(async () => {
      const dom = mount(getComponentWithNoVerticalList());
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(PageLayout, dom);
      });
    });

    test('should render in tablet mode', () => {
      global.matchMedia = media => ({
        addListener: () => {},
        removeListener: () => {},
        matches: media === '(min-width: 992px)',
      });

      // verify the shape of different components
      expect(wrapper.find(PageSelect).prop('direction')).toBe('row');
      expect(wrapper.find(LinkButtonGroup).prop('direction')).toBe('row');
      expect(wrapper.find(Share).prop('direction')).toBe('row');
    });

    test('should render in desktop mode', () => {
      global.matchMedia = media => ({
        addListener: () => {},
        removeListener: () => {},
        matches: media !== '(min-width: 992px)',
      });

      // verify the shape of different components
      expect(wrapper.find(PageSelect).prop('direction')).toBe('column');
      expect(wrapper.find(LinkButtonGroup).prop('direction')).toBe('column');
      expect(wrapper.find(Share).prop('direction')).toBe('column');
    });
  });
});
