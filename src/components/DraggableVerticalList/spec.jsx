import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import ClearIcon from '@material-ui/icons/Clear';
import DotsIcon from '@material-ui/icons/MoreHoriz';

import DraggableVerticalList from '.';
import { IconBiofuel, IconCoal, IconElectricity, IconGas, IconOil } from '../../icons';
import { TestContainer, getRendered } from '../../tests/utilities';

const DEFAULT_CONFIG = {
  mainSelection: 'energyDemand',
  yearId: '2020',
  scenarios: ['Evolving'],
  view: 'region',
};

const getSourceComponent = (configs, props) => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...configs }}>
    <DraggableVerticalList
      title="Source"
      round
      disabled={props?.disabled || false}
      singleSelect={props?.singleSelect || false}
      sourceType="energy"
      items={['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL']}
      itemOrder={['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL']}
      defaultItems={{
        BIO: { color: '#1C7F24', label: 'Biofuels & Emerging Energy', icon: IconBiofuel },
        COAL: { color: '#4B5E5B', label: 'Coal, Coke & Coke Oven Gas', icon: IconCoal },
        ELECTRICITY: { color: '#7ACBCB', label: 'Electricity', icon: IconElectricity },
        GAS: { color: '#890038', label: 'Natural Gas', icon: IconGas },
        OIL: { color: '#FF821E', label: 'Oil Products', icon: IconOil },
      }}
      defaultItemOrder={['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL']}
    />
  </TestContainer>
);

describe('Component|HorizontalControlBar', () => {
  let wrapper;

  /**
   * Multi-select draggable list
   */
  describe('Test multi-select draggable list', () => {
    beforeEach(async () => {
      const dom = mount(getSourceComponent({ page: 'by-sector', sector: 'TRANSPORTATION' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(DraggableVerticalList, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render normal and draggable nodes', () => {
      // check 5 icons as inputted
      expect(wrapper.find(Draggable).length).toBe(5);
      expect(wrapper.find(Draggable).map(node => node.prop('draggableId'))).toEqual(['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL']);

      expect(wrapper.find(IconBiofuel)).not.toBeNull();
      expect(wrapper.find(IconCoal)).not.toBeNull();
      expect(wrapper.find(IconElectricity)).not.toBeNull();
      expect(wrapper.find(IconGas)).not.toBeNull();
      expect(wrapper.find(IconOil)).not.toBeNull();

      // draggable list, so 3 dots icons / drag indicators
      const dotsIcons = wrapper.find(DotsIcon);
      expect(dotsIcons.length).toBe(5);

      // all selected, so should display the clear icon
      const clearIcons = wrapper.find(ClearIcon);
      expect(clearIcons.length).toBe(1);

      /* eslint-disable newline-per-chained-call */
      wrapper.find(Droppable).at(0).find('.MuiGrid-item').at(0).simulate('keypress', { key: 'Enter' });
      wrapper.find(Draggable).at(1).find('.MuiGrid-item').at(0).simulate('click');
      wrapper.find(Draggable).at(2).find('.MuiGrid-item').at(0).simulate('keypress', { key: 'Enter' });

      const mockDataTransfer = { setData: jest.fn() };
      wrapper.find(Draggable).at(2).find('.MuiGrid-item').at(0).simulate('dragstart', mockDataTransfer);
      wrapper.find(Draggable).at(1).find('.MuiGrid-item').at(0).simulate('dragover');
      wrapper.find(Draggable).at(0).find('.MuiGrid-item').at(0).simulate('dragend');
    });
  });

  /**
   * Single-select static list
   */
  describe('Test single-select static list', () => {
    beforeEach(async () => {
      const dom = mount(getSourceComponent({ page: 'by-sector', sector: 'ALL' }, { singleSelect: true }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(DraggableVerticalList, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render static nodes', () => {
      wrapper.find(Draggable).at(0).find('.MuiGrid-item').at(0).simulate('click');
    });
  });

  /**
   * Disable drag-n-drop list
   */
  describe('Test list with disabled drag-n-drop', () => {
    beforeEach(async () => {
      const dom = mount(getSourceComponent({ page: 'by-sector', sector: 'ALL' }, { disabled: true }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(DraggableVerticalList, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render static nodes', () => {
      // non-draggable, so no dots icons are shown
      const dotsIcons = wrapper.find(DotsIcon);
      expect(dotsIcons.length).toBe(0);
    });
  });
});
