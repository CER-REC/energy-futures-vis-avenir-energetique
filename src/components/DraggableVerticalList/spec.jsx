import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { Grid } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import DotsIcon from '@material-ui/icons/MoreHoriz';

import DraggableVerticalList from '.';
import { IconBiofuel, IconCoal, IconElectricity, IconGas, IconOil } from '../../icons';
import { TestContainer, getRendered } from '../../tests/utilities';
import ColoredItemBox from './ColoredItemBox';

const mockFn = jest.fn();

const DEFAULT_CONFIG = {
  mainSelection: 'energyDemand',
  yearId: '2020',
  scenarios: ['Evolving'],
  sector: 'TRANSPORTATION',
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
      title={props?.title || 'Source'}
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
      wrapper = mount(getSourceComponent({ page: 'by-sector' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(getRendered(DraggableVerticalList, wrapper).exists()).toBeTruthy();
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

      // test drag-n-drop
      await act(async () => {
        expect(wrapper.find(Draggable).map(node => node.prop('draggableId'))).toEqual(['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL']);
        wrapper.find(DragDropContext).at(0).prop('onDragEnd')(MOCK_DROP);
        wrapper.find(DragDropContext).at(0).prop('onDragEnd')({ ...MOCK_DROP, destination: { droppableId: 'droppable', index: 2 } });
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(wrapper.find(Draggable).map(node => node.prop('draggableId'))).toEqual(['COAL', 'ELECTRICITY', 'BIO', 'GAS', 'OIL']);
      });

      // test delect & deselect nodes
      await act(async () => {
        // all nodes selected; num of selected = 5
        expect(wrapper.find(Draggable).findWhere(node => node.type() === Grid && node.hasClass('selected'))).toHaveLength(5);

        // click the clear button to deselect all num of selected = 0
        wrapper.find(ColoredItemBox).at(0).closest(Grid).prop('onClick')();
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(wrapper.find(Draggable).findWhere(node => node.type() === Grid && node.hasClass('selected'))).toHaveLength(0);

        // click one of the nodes to select it num of selected = 1
        wrapper.find(ColoredItemBox).at(2).closest(Grid).prop('onClick')();
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(wrapper.find(Draggable).findWhere(node => node.type() === Grid && node.hasClass('selected'))).toHaveLength(1);

        // click the "ALL" button to select all num of selected = 5
        wrapper.find(ColoredItemBox).at(0).closest(Grid).prop('onClick')();
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(wrapper.find(Draggable).findWhere(node => node.type() === Grid && node.hasClass('selected'))).toHaveLength(5);
      });

      // use key press to deselect and select nodes
      await act(async () => {
        // all nodes selected; num of selected = 5
        expect(wrapper.find(Draggable).findWhere(node => node.type() === Grid && node.hasClass('selected'))).toHaveLength(5);

        // use key press to deselect all nodes; num of selected = 0
        wrapper.find(ColoredItemBox).at(0).closest(Grid).prop('onKeyPress')({ key: 'Enter' });
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(wrapper.find(Draggable).findWhere(node => node.type() === Grid && node.hasClass('selected'))).toHaveLength(0);

        // use key press to re-select all nodes; num of selected = 5
        wrapper.find(ColoredItemBox).at(0).closest(Grid).prop('onKeyPress')({ key: 'Enter' });
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(wrapper.find(Draggable).findWhere(node => node.type() === Grid && node.hasClass('selected'))).toHaveLength(5);
      });
    });
  });

  /**
   * Items do not match with config
   */
  describe('Test if items do not match', () => {
    beforeEach(async () => {
      wrapper = mount(getSourceComponent({ page: 'by-sector', sources: ['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL'] }, { items: ['BIO'], setItems: mockFn() }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component and content', () => {
      expect(getRendered(DraggableVerticalList, wrapper).exists()).toBeTruthy();
      expect(wrapper.find(Draggable).find(ColoredItemBox)).toHaveLength(5);
      expect(mockFn).toHaveBeenCalled();
    });
  });

  /**
   * Single-select static Source list
   */
  describe('Test single-select static source list', () => {
    beforeEach(async () => {
      wrapper = mount(getSourceComponent({ page: 'by-sector', sector: 'ALL' }, { singleSelect: true, items: ['BIO'] }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(getRendered(DraggableVerticalList, wrapper).exists()).toBeTruthy();
    });

    test('should render static nodes', async () => {
      // only 1 selected
      expect(wrapper.find(Draggable).findWhere(node => node.type() === Grid && node.hasClass('selected'))).toHaveLength(1);

      await act(async () => {
        // 2nd node selected
        expect(wrapper.find(ColoredItemBox).at(0).prop('selected')).toBeFalsy();
        expect(wrapper.find(ColoredItemBox).at(1).prop('selected')).toBeTruthy();

        // click the 1st node and verify it is selected
        wrapper.find(ColoredItemBox).at(0).closest(Grid).prop('onClick')();
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(wrapper.find(ColoredItemBox).at(0).prop('selected')).toBeTruthy();
        expect(wrapper.find(ColoredItemBox).at(1).prop('selected')).toBeFalsy();

        // press ENTER on the 2nd node the verify it is selected
        wrapper.find(ColoredItemBox).at(1).closest(Grid).prop('onKeyPress')({ key: 'Enter' });
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(wrapper.find(ColoredItemBox).at(0).prop('selected')).toBeFalsy();
        expect(wrapper.find(ColoredItemBox).at(1).prop('selected')).toBeTruthy();
      });

      // again, only 1 selected
      expect(wrapper.find(Draggable).findWhere(node => node.type() === Grid && node.hasClass('selected'))).toHaveLength(1);
    });
  });

  /**
   * Single-select static Region list
   */
  describe('Test single-select static region list', () => {
    beforeEach(async () => {
      wrapper = mount(getSourceComponent({ page: 'by-sector', sector: 'ALL' }, { title: 'Region', singleSelect: true, items: ['BIO'] }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(getRendered(DraggableVerticalList, wrapper).exists()).toBeTruthy();
    });

    test('should render static nodes', async () => {
      // only 1 selected
      expect(wrapper.find(Draggable).findWhere(node => node.type() === Grid && node.hasClass('selected'))).toHaveLength(1);

      await act(async () => {
        // 2nd node selected
        expect(wrapper.find(ColoredItemBox).at(0).prop('selected')).toBeFalsy();
        expect(wrapper.find(ColoredItemBox).at(1).prop('selected')).toBeTruthy();

        // click the 1st node and verify it is selected
        wrapper.find(ColoredItemBox).at(0).closest(Grid).prop('onClick')();
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(wrapper.find(ColoredItemBox).at(0).prop('selected')).toBeTruthy();
        expect(wrapper.find(ColoredItemBox).at(1).prop('selected')).toBeFalsy();

        // press ENTER on the 2nd node the verify it is selected
        wrapper.find(ColoredItemBox).at(1).closest(Grid).prop('onKeyPress')({ key: 'Enter' });
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(wrapper.find(ColoredItemBox).at(0).prop('selected')).toBeFalsy();
        expect(wrapper.find(ColoredItemBox).at(1).prop('selected')).toBeTruthy();
      });

      // again, only 1 selected
      expect(wrapper.find(Draggable).findWhere(node => node.type() === Grid && node.hasClass('selected'))).toHaveLength(1);
    });
  });

  /**
   * Disable drag-n-drop list
   */
  describe('Test list with disabled drag-n-drop', () => {
    beforeEach(async () => {
      wrapper = mount(getSourceComponent({ page: 'by-sector', sector: 'ALL' }, { disabled: true }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(getRendered(DraggableVerticalList, wrapper).exists()).toBeTruthy();
    });

    test('should render static nodes', () => {
      // non-draggable, so no dots icons are shown
      expect(wrapper.find(DotsIcon)).toHaveLength(0);
    });
  });
});
