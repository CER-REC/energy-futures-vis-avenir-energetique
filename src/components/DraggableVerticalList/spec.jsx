import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
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

const MOCK_DROP = {
  type: 'DEFAULT',
  source: { index: 0, droppableId: 'droppable' },
  draggableId: 'BIO',
  mode: 'FLUID',
  reason: 'DROP',
};

const getSourceComponent = (configs, props) => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...configs }}>
    <DraggableVerticalList
      title={props?.disabled || 'Source'}
      round
      disabled={props?.disabled || false}
      singleSelect={props?.singleSelect || false}
      sourceType="energy"
      items={props?.items || ['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL']}
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

describe('Component|DraggableVerticalList', () => {
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

    test('should render normal and draggable nodes', async () => {
      // check 5 icons as inputted
      expect(wrapper.find(Draggable)).toHaveLength(5);
      expect(wrapper.find(Draggable).map(node => node.prop('draggableId'))).toEqual(['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL']);

      expect(wrapper.find(IconBiofuel).exists()).toBeTruthy();
      expect(wrapper.find(IconCoal).exists()).toBeTruthy();
      expect(wrapper.find(IconElectricity).exists()).toBeTruthy();
      expect(wrapper.find(IconGas).exists()).toBeTruthy();
      expect(wrapper.find(IconOil).exists()).toBeTruthy();

      // draggable list, so 3 dots icons / drag indicators
      expect(wrapper.find(DotsIcon)).toHaveLength(5);

      // all selected, so should display the clear icon
      expect(wrapper.find(ClearIcon)).toHaveLength(1);

      await act(async () => {
        /* eslint-disable newline-per-chained-call */
        wrapper.find(DragDropContext).at(0).prop('onDragEnd')(MOCK_DROP);
        wrapper.find(DragDropContext).at(0).prop('onDragEnd')({ ...MOCK_DROP, destination: { droppableId: 'droppable', index: 2 } });

        wrapper.find(Draggable).at(1).find('.MuiGrid-item').at(0).prop('onClick')();
        wrapper.find(Draggable).at(1).find('.MuiGrid-item').at(0).prop('onKeyPress')({ key: 'Enter' });

        wrapper.find(Draggable).at(2).find('.MuiGrid-item').at(0).prop('onKeyPress')({ key: 'Space' });
        wrapper.find(Draggable).at(2).find('.MuiGrid-item').at(0).prop('onKeyPress')({ key: 'ArrowDown' });
        wrapper.find(Draggable).at(2).find('.MuiGrid-item').at(0).prop('onKeyPress')({ key: 'Space' });
        /* eslint-enable newline-per-chained-call */
      });
    });
  });

  /**
   * Single-select static list
   */
  describe('Test single-select static list', () => {
    beforeEach(async () => {
      const dom = mount(getSourceComponent({ page: 'by-sector', sector: 'ALL' }, { singleSelect: true, items: ['BIO'] }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(DraggableVerticalList, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render static nodes', async () => {
      const numOfSelected = wrapper.find(Draggable).find('.MuiGrid-container')
        .map(box => box.prop('className').split(' '))
        .flat()
        .filter(className => className === 'selected');
      expect(numOfSelected).toHaveLength(1);

      await act(async () => {
        const allButton = wrapper.findWhere(node => node.hasClass('MuiGrid-item') && node.text() === 'All').at(0);
        allButton.prop('onClick')();
        allButton.prop('onKeyPress')({ key: 'Enter' });
      });
    });
  });

  /**
   * Single-select static Region list
   */
  describe('Test single-select static list', () => {
    beforeEach(async () => {
      const dom = mount(getSourceComponent({ page: 'by-sector', sector: 'ALL' }, { title: 'Region', singleSelect: true, items: ['BIO'] }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(DraggableVerticalList, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render static nodes', async () => {
      await act(async () => {
        const allButton = wrapper.findWhere(node => node.hasClass('MuiGrid-item') && node.text() === 'All').at(0);
        allButton.prop('onClick')();
        allButton.prop('onKeyPress')({ key: 'Enter' });
      });
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
      expect(wrapper.find(DotsIcon)).toHaveLength(0);
    });
  });
});
