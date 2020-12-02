import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { Typography, IconButton, Button } from '@material-ui/core';

import HorizontalControlBar from '.';
import { IconTransportation, IconResidential, IconCommercial, IconIndustrial } from '../../icons';
import { HintMainSelect, HintSectorSelect, HintViewSelect, HintUnitSelect } from '../Hint';
import { TestContainer, getRendered } from '../../tests/utilities';

const DEFAULT_CONFIG = {
  mainSelection: 'energyDemand',
  yearId: '2020',
  scenarios: ['Evolving'],
  view: 'region',
};

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
      const dom = mount(getComponent({ page: 'by-region' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(HorizontalControlBar, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render section titles', () => {
      const titles = wrapper.find(Typography);
      expect(['UNIT']).toEqual(expect.arrayContaining(titles.map(title => title.text())));
    });

    test('should render section buttons', () => {
      // 2 'help' buttons
      const iconButtons = wrapper.find(IconButton);
      expect(iconButtons.length).toBe(2);

      expect(wrapper.find(HintMainSelect)).not.toBeNull();
      expect(wrapper.find(HintUnitSelect)).not.toBeNull();

      // 6 regular buttons
      const buttons = wrapper.find(Button);
      expect(buttons.length).toBe(6);
      expect(['Total Demand', 'Electricity Generation', 'Oil Production', 'Gas Production', 'PJ', 'Mboe/d']).toEqual(expect.arrayContaining(buttons.map(btn => btn.text())));
    });

    test('should select correct buttons', () => {
      const buttons = wrapper.find('.MuiButton-contained');
      expect(['Total Demand', 'PJ']).toEqual(expect.arrayContaining(buttons.map(btn => btn.text())));
    });

    test('should buttons clickable', () => {
      const button = wrapper.findWhere(node => node.type() === 'button' && node.text() === 'Electricity Generation');
      button.simulate('click');
    });
  });

  /**
   * By-Sector page
   */
  describe('Test page by-sector', () => {
    beforeEach(async () => {
      const dom = mount(getComponent({ page: 'by-sector' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(HorizontalControlBar, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render section titles', () => {
      const titles = wrapper.find(Typography);
      expect(['SECTOR', 'UNIT']).toEqual(expect.arrayContaining(titles.map(title => title.text())));
    });

    test('should render section buttons', () => {
      // 2 'help' buttons
      const iconButtons = wrapper.find(IconButton);
      expect(iconButtons.length).toBe(2);

      expect(wrapper.find(HintSectorSelect)).not.toBeNull();
      expect(wrapper.find(HintUnitSelect)).not.toBeNull();

      // 7 regular buttons
      const buttons = wrapper.find(Button);
      expect(buttons.length).toBe(7);

      expect(wrapper.find(IconTransportation)).not.toBeNull();
      expect(wrapper.find(IconResidential)).not.toBeNull();
      expect(wrapper.find(IconCommercial)).not.toBeNull();
      expect(wrapper.find(IconIndustrial)).not.toBeNull();
      expect(['Total Demand', 'PJ', 'Mboe/d']).toEqual(expect.arrayContaining(buttons.map(btn => btn.text()).filter(Boolean)));
    });

    test('should select correct buttons', () => {
      const buttons = wrapper.find('.MuiButton-contained');
      expect(['Total Demand', 'PJ']).toEqual(expect.arrayContaining(buttons.map(btn => btn.text())));
    });

    test('should buttons clickable', () => {
      const button = wrapper.findWhere(node => node.type() === 'button' && node.text() === 'Total Demand');
      button.simulate('click');
    });
  });

  /**
   * Electricity page
   */
  describe('Test page electricity', () => {
    beforeEach(async () => {
      const dom = mount(getComponent({ page: 'electricity', mainSelection: 'electricityGeneration' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(HorizontalControlBar, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render section titles', () => {
      const titles = wrapper.find(Typography);
      expect(['VIEW BY', 'UNIT']).toEqual(expect.arrayContaining(titles.map(title => title.text())));
    });

    test('should render section buttons', () => {
      // 2 'help' buttons
      const iconButtons = wrapper.find(IconButton);
      expect(iconButtons.length).toBe(2);

      expect(wrapper.find(HintViewSelect)).not.toBeNull();
      expect(wrapper.find(HintUnitSelect)).not.toBeNull();

      // 5 regular buttons
      const buttons = wrapper.find(Button);
      expect(buttons.length).toBe(5);
      expect(['Region', 'Source', 'GW.h', 'PJ', 'Mboe/d']).toEqual(expect.arrayContaining(buttons.map(btn => btn.text()).filter(Boolean)));
    });

    test('should select correct buttons', () => {
      const buttons = wrapper.find('.MuiButton-contained');
      expect(['Region', 'GW.h']).toEqual(expect.arrayContaining(buttons.map(btn => btn.text())));
    });

    test('should select correct buttons', () => {
      const buttons = wrapper.find('.MuiButton-contained');
      expect(['Region', 'GW.h']).toEqual(expect.arrayContaining(buttons.map(btn => btn.text())));
    });

    test('should buttons clickable', () => {
      const button = wrapper.findWhere(node => node.type() === 'button' && node.text() === 'Source');
      button.simulate('click');
    });
  });

  /**
   * Scenarios page
   */
  describe('Test page scenario', () => {
    beforeEach(async () => {
      const dom = mount(getComponent({ page: 'scenarios' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(HorizontalControlBar, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render section titles', () => {
      const titles = wrapper.find(Typography);
      expect(['VIEW BY', 'UNIT']).toEqual(expect.arrayContaining(titles.map(title => title.text())));
    });

    test('should render section buttons', () => {
      // 2 'help' buttons
      const iconButtons = wrapper.find(IconButton);
      expect(iconButtons.length).toBe(2);

      expect(wrapper.find(HintMainSelect)).not.toBeNull();
      expect(wrapper.find(HintUnitSelect)).not.toBeNull();

      // 6 regular buttons
      const buttons = wrapper.find(Button);
      expect(buttons.length).toBe(6);
      expect(['Total Demand', 'Electricity Generation', 'Oil Production', 'Gas Production', 'PJ', 'Mboe/d']).toEqual(expect.arrayContaining(buttons.map(btn => btn.text())));
    });

    test('should select correct buttons', () => {
      const buttons = wrapper.find('.MuiButton-contained');
      expect(['Total Demand', 'PJ']).toEqual(expect.arrayContaining(buttons.map(btn => btn.text())));
    });

    test('should buttons clickable', () => {
      const button = wrapper.findWhere(node => node.type() === 'button' && node.text() === 'Mboe/d');
      button.simulate('click');
    });
  });

  /**
   * Oil-and-Gas page
   */
  describe('Test page oil-and-gas', () => {
    beforeEach(async () => {
      const dom = mount(getComponent({ page: 'oil-and-gas', mainSelection: 'oilProduction' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(HorizontalControlBar, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render section titles', () => {
      const titles = wrapper.find(Typography);
      expect(['VIEW BY', 'UNIT']).toEqual(expect.arrayContaining(titles.map(title => title.text())));
    });

    test('should render section buttons', () => {
      // 3 'help' buttons
      const iconButtons = wrapper.find(IconButton);
      expect(iconButtons.length).toBe(3);

      expect(wrapper.find(HintMainSelect)).not.toBeNull();
      expect(wrapper.find(HintViewSelect)).not.toBeNull();
      expect(wrapper.find(HintUnitSelect)).not.toBeNull();

      // 6 regular buttons
      const buttons = wrapper.find(Button);
      expect(buttons.length).toBe(6);
      expect(['Oil Production', 'Gas Production', 'Region', 'Type', 'Mb/d', '10³m³/d']).toEqual(expect.arrayContaining(buttons.map(btn => btn.text())));
    });

    test('should select correct buttons', () => {
      const buttons = wrapper.find('.MuiButton-contained');
      expect(['Oil Production', 'Region', 'Mb/d']).toEqual(expect.arrayContaining(buttons.map(btn => btn.text())));
    });

    test('should buttons clickable', () => {
      const button = wrapper.findWhere(node => node.type() === 'button' && node.text() === 'Type');
      button.simulate('click');
    });
  });

  /**
   * Test a fake page; this should fail.
   */
  describe('Test non-existing page', () => {
    beforeEach(async () => {
      const dom = mount(getComponent({ mainSelection: 'mock-up' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(HorizontalControlBar, dom);
      });
    });

    test('should NOT render component', () => {
      expect(wrapper.exists()).toBeFalsy();
    });
  });
});
