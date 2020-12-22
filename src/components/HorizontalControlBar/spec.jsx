import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { Typography, IconButton, Button } from '@material-ui/core';
import analytics from '../../analytics';

import HorizontalControlBar from '.';
import { IconTransportation, IconResidential, IconCommercial, IconIndustrial } from '../../icons';
import { HintMainSelect, HintSectorSelect, HintViewSelect, HintUnitSelect } from '../Hint';
import { TestContainer, getRendered } from '../../tests/utilities';

const DEFAULT_CONFIG = {
  mainSelection: 'energyDemand',
  yearId: '2020',
  scenarios: ['Evolving'],
  view: 'region',
  unit: 'petajoules',
};

const spyAnalytics = jest.spyOn(analytics, 'reportFeature');

const getComponent = props => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
    <HorizontalControlBar />
  </TestContainer>
);

describe('Component|HorizontalControlBar', () => {
  let wrapper;

  /**
   * By-Region page
   */
  describe('Test page by-region', () => {
    beforeEach(async () => {
      wrapper = mount(getComponent({ page: 'by-region' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(getRendered(HorizontalControlBar, wrapper).exists()).toBeTruthy();
    });

    test('should render section titles', () => {
      expect(wrapper.findWhere(node => node.type() === Typography && node.text() === 'UNIT').exists()).toBeTruthy();
    });

    test('should render section buttons', () => {
      // 2 'help' buttons
      expect(wrapper.find(IconButton)).toHaveLength(2);

      expect(wrapper.find(HintMainSelect).exists()).toBeTruthy();
      expect(wrapper.find(HintUnitSelect).exists()).toBeTruthy();

      // 6 regular buttons
      expect(wrapper.find(Button)).toHaveLength(6);
      expect(wrapper.find(Button).map(btn => btn.text()).sort()).toEqual(['Total Demand', 'Electricity Generation', 'Oil Production', 'Gas Production', 'PJ', 'Mboe/d'].sort());
    });

    test('should select correct buttons', () => {
      expect(wrapper.findWhere(node => node.type() === Button && node.text() === 'Total Demand').at(0).prop('variant')).toEqual('contained');
      expect(wrapper.findWhere(node => node.type() === Button && node.text() === 'PJ').at(0).prop('variant')).toEqual('contained');
    });

    test('should buttons clickable', async () => {
      await act(async () => {
        wrapper.findWhere(node => node.type() === Button && node.text() === 'Electricity Generation').at(0).prop('onClick')();
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(spyAnalytics).toBeCalled();
      });
    });
  });

  /**
   * By-Sector page
   */
  describe('Test page by-sector', () => {
    beforeEach(async () => {
      wrapper = mount(getComponent({ page: 'by-sector', sector: 'ALL' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(getRendered(HorizontalControlBar, wrapper).exists()).toBeTruthy();
    });

    test('should render section titles', () => {
      expect(wrapper.findWhere(node => node.type() === Typography && node.text() === 'SECTOR').exists()).toBeTruthy();
      expect(wrapper.findWhere(node => node.type() === Typography && node.text() === 'UNIT').exists()).toBeTruthy();
    });

    test('should render section buttons', () => {
      // 2 'help' buttons
      expect(wrapper.find(IconButton)).toHaveLength(2);

      expect(wrapper.find(HintSectorSelect).exists()).toBeTruthy();
      expect(wrapper.find(HintUnitSelect).exists()).toBeTruthy();

      // 7 regular buttons
      expect(wrapper.find(Button)).toHaveLength(7);

      expect(wrapper.find(IconTransportation).exists()).toBeTruthy();
      expect(wrapper.find(IconResidential).exists()).toBeTruthy();
      expect(wrapper.find(IconCommercial).exists()).toBeTruthy();
      expect(wrapper.find(IconIndustrial).exists()).toBeTruthy();
      expect(wrapper.find(Button).map(btn => btn.text()).filter(Boolean).sort()).toEqual(['Total Demand', 'PJ', 'Mboe/d'].sort());
    });

    test('should select correct buttons', () => {
      expect(wrapper.findWhere(node => node.type() === Button && node.text() === 'Total Demand').at(0).prop('variant')).toEqual('contained');
      expect(wrapper.findWhere(node => node.type() === Button && node.text() === 'PJ').at(0).prop('variant')).toEqual('contained');
    });

    test('should buttons clickable', async () => {
      await act(async () => {
        wrapper.findWhere(node => node.type() === Button && node.text() === 'Total Demand').at(0).prop('onClick')();
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(spyAnalytics).toBeCalled();
      });
    });
  });

  /**
   * Electricity page
   */
  describe('Test page electricity', () => {
    beforeEach(async () => {
      wrapper = mount(getComponent({ page: 'electricity', mainSelection: 'electricityGeneration', unit: 'gigawattHours' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(getRendered(HorizontalControlBar, wrapper).exists()).toBeTruthy();
    });

    test('should render section titles', () => {
      expect(wrapper.findWhere(node => node.type() === Typography && node.text() === 'VIEW BY').exists()).toBeTruthy();
      expect(wrapper.findWhere(node => node.type() === Typography && node.text() === 'UNIT').exists()).toBeTruthy();
    });

    test('should render section buttons', () => {
      // 2 'help' buttons
      expect(wrapper.find(IconButton)).toHaveLength(2);

      expect(wrapper.find(HintViewSelect).exists()).toBeTruthy();
      expect(wrapper.find(HintUnitSelect).exists()).toBeTruthy();

      // 5 regular buttons
      expect(wrapper.find(Button)).toHaveLength(5);
      expect(wrapper.find(Button).map(btn => btn.text()).filter(Boolean).sort()).toEqual(['Region', 'Source', 'GW.h', 'PJ', 'Mboe/d'].sort());
    });

    test('should select correct buttons', () => {
      expect(wrapper.findWhere(node => node.type() === Button && node.text() === 'Region').at(0).prop('variant')).toEqual('contained');
      expect(wrapper.findWhere(node => node.type() === Button && node.text() === 'GW.h').at(0).prop('variant')).toEqual('contained');
    });

    test('should buttons clickable', async () => {
      await act(async () => {
        wrapper.findWhere(node => node.type() === Button && node.text() === 'Source').at(0).prop('onClick')();
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(spyAnalytics).toBeCalled();
      });
    });
  });

  /**
   * Scenarios page
   */
  describe('Test page scenario', () => {
    beforeEach(async () => {
      wrapper = mount(getComponent({ page: 'scenarios' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(getRendered(HorizontalControlBar, wrapper).exists()).toBeTruthy();
    });

    test('should render section titles', () => {
      expect(wrapper.findWhere(node => node.type() === Typography && node.text() === 'UNIT').exists()).toBeTruthy();
    });

    test('should render section buttons', () => {
      // 2 'help' buttons
      expect(wrapper.find(IconButton)).toHaveLength(2);

      expect(wrapper.find(HintMainSelect).exists()).toBeTruthy();
      expect(wrapper.find(HintUnitSelect).exists()).toBeTruthy();

      // 6 regular buttons
      expect(wrapper.find(Button)).toHaveLength(6);
      expect(wrapper.find(Button).map(btn => btn.text()).sort()).toEqual(['Total Demand', 'Electricity Generation', 'Oil Production', 'Gas Production', 'PJ', 'Mboe/d'].sort());
    });

    test('should select correct buttons', () => {
      expect(wrapper.findWhere(node => node.type() === Button && node.text() === 'Total Demand').at(0).prop('variant')).toEqual('contained');
      expect(wrapper.findWhere(node => node.type() === Button && node.text() === 'PJ').at(0).prop('variant')).toEqual('contained');
    });

    test('should buttons clickable', async () => {
      await act(async () => {
        wrapper.findWhere(node => node.type() === Button && node.text() === 'Mboe/d').at(0).prop('onClick')();
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(spyAnalytics).toBeCalled();
      });
    });
  });

  /**
   * Oil-and-Gas page
   */
  describe('Test page oil-and-gas', () => {
    beforeEach(async () => {
      wrapper = mount(getComponent({ page: 'oil-and-gas', mainSelection: 'oilProduction', unit: 'kilobarrels' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(getRendered(HorizontalControlBar, wrapper).exists()).toBeTruthy();
    });

    test('should render section titles', () => {
      expect(wrapper.findWhere(node => node.type() === Typography && node.text() === 'VIEW BY').exists()).toBeTruthy();
      expect(wrapper.findWhere(node => node.type() === Typography && node.text() === 'UNIT').exists()).toBeTruthy();
    });

    test('should render section buttons', () => {
      // 3 'help' buttons
      expect(wrapper.find(IconButton)).toHaveLength(3);

      expect(wrapper.find(HintMainSelect).exists()).toBeTruthy();
      expect(wrapper.find(HintViewSelect).exists()).toBeTruthy();
      expect(wrapper.find(HintUnitSelect).exists()).toBeTruthy();

      // 6 regular buttons
      expect(wrapper.find(Button)).toHaveLength(6);
      expect(wrapper.find(Button).map(btn => btn.text()).sort()).toEqual(['Oil Production', 'Gas Production', 'Region', 'Type', 'Mb/d', '10³m³/d'].sort());
    });

    test('should select correct buttons', () => {
      expect(wrapper.findWhere(node => node.type() === Button && node.text() === 'Oil Production').at(0).prop('variant')).toEqual('contained');
      expect(wrapper.findWhere(node => node.type() === Button && node.text() === 'Region').at(0).prop('variant')).toEqual('contained');
      expect(wrapper.findWhere(node => node.type() === Button && node.text() === 'Mb/d').at(0).prop('variant')).toEqual('contained');
    });

    test('should buttons clickable', async () => {
      await act(async () => {
        wrapper.findWhere(node => node.type() === Button && node.text() === 'Type').at(0).prop('onClick')();
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(spyAnalytics).toBeCalled();
      });
    });
  });

  /**
   * Test a fake page; this should fail.
   */
  describe('Test non-existing page', () => {
    beforeEach(async () => {
      wrapper = mount(getComponent({ mainSelection: 'mock-up' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should NOT render component', () => {
      expect(getRendered(HorizontalControlBar, wrapper).exists()).toBeFalsy();
    });
  });
});
