import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { IconButton, Dialog, Fab } from '@material-ui/core';

import {
  HintMainSelect, HintYearSelect, HintScenarioSelect, HintSectorSelect,
  HintViewSelect, HintUnitSelect, HintRegionList, HintSourceList,
} from '.';
import { TestContainer, getRendered } from '../../tests/utilities';

describe('Component|Hint', () => {
  /**
   * HintMainSelect
   */
  describe('Test HintMainSelect', () => {
    const wrapper = mount(<TestContainer><HintMainSelect /></TestContainer>);

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });
  });

  /**
   * HintYearSelect
   */
  describe('Test HintYearSelect', () => {
    const wrapper = mount(<TestContainer><HintYearSelect /></TestContainer>);

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });
  });

  /**
   * HintScenarioSelect
   */
  describe('Test HintScenarioSelect', () => {
    const dom = mount(
      <TestContainer mockConfig={{ yearId: 2020 }}>
        <HintScenarioSelect />
      </TestContainer>,
    );

    test('should render component', async () => {
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        const wrapper = getRendered(HintScenarioSelect, dom);
        expect(wrapper.type()).not.toBeNull();
      });
    });
  });

  /**
   * HintSectorSelect
   */
  describe('Test HintSectorSelect', () => {
    const wrapper = mount(<TestContainer><HintSectorSelect /></TestContainer>);

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });
  });

  /**
   * HintViewSelect
   */
  describe('Test HintViewSelect', () => {
    const dom = mount(
      <TestContainer mockConfig={{ page: 'electricity' }}>
        <HintViewSelect />
      </TestContainer>,
    );

    test('should render component', async () => {
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        const wrapper = getRendered(HintViewSelect, dom);
        expect(wrapper.type()).not.toBeNull();
      });
    });
  });

  /**
   * HintUnitSelect
   */
  describe('Test HintUnitSelect', () => {
    const wrapper = mount(<TestContainer><HintUnitSelect /></TestContainer>);

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });
  });

  /**
   * HintRegionList
   */
  describe('Test HintRegionList', () => {
    const wrapper = mount(<TestContainer><HintRegionList /></TestContainer>);

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render dialog', () => {
      // look for the 'help' icon button
      const iconButtons = wrapper.find(IconButton);
      expect(iconButtons.length).toBe(1);

      // click on the icon button to verify the dialog
      iconButtons.at(0).simulate('click');
      const dialog = wrapper.find(Dialog);
      expect(dialog).not.toBeNull();
      expect(dialog.text().includes('Keyboard Shortcut')).toBe(true);

      // click on the close button to dismiss the dialog
      const closeButton = dialog.find(Fab);
      closeButton.at(0).simulate('click');
      expect(wrapper.contains(dialog)).toBe(false);
    });
  });

  /**
   * HintSourceList
   */
  describe('Test HintSourceList', () => {
    const SOURCES = {
      BIO: { color: '#1C7F24', label: 'Biomass / Geothermal' },
      COAL: { color: '#4B5E5B', label: 'Coal & Coke' },
      GAS: { color: '#890038', label: 'Natural Gas' },
      HYDRO: { color: '#5FBEE6', label: 'Hydro / Wave / Tidal' },
      NUCLEAR: { color: '#753B95', label: 'Nuclear' },
      OIL: { color: '#FF821E', label: 'Oil' },
      RENEWABLE: { color: '#FFCC47', label: 'Solar / Wind' },
    };

    const wrapper = mount(
      <TestContainer>
        <HintSourceList sources={SOURCES} sourceType="electricity" />
      </TestContainer>,
    );

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render dialog', () => {
      // look for the 'help' icon button
      const iconButtons = wrapper.find(IconButton);
      expect(iconButtons.length).toBe(1);

      // click on the icon button to verify the dialog
      iconButtons.at(0).simulate('click');
      const dialog = wrapper.find(Dialog);
      expect(dialog).not.toBeNull();
      expect(dialog.text().includes('Keyboard Shortcut')).toBe(true);

      // click on the close button to dismiss the dialog
      const closeButton = dialog.find(Fab);
      closeButton.at(0).simulate('click');
      expect(wrapper.contains(dialog)).toBe(false);
    });
  });
});
