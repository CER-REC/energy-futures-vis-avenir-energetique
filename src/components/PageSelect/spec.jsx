import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ButtonBase } from '@material-ui/core';
import PageSelect from '.';
import { TestContainer, getRendered } from '../../tests/utilities';
import {
  IconPageRegion, IconPageSector, IconPageElectricity, IconPageScenarios, IconPageOilAndGas,
} from '../../icons';

const DEFAULT_CONFIG = {
  mainSelection: 'energyDemand',
  yearId: '2020',
  scenarios: ['Evolving'],
  view: 'region',
};

// #region PageSelect

const getSelectComponent = props => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
    <PageSelect />
  </TestContainer>
);

describe('Component|PageSelect', () => {
  let wrapper;

  beforeEach(async () => {
    const dom = mount(getSelectComponent({ page: 'by-region' }));
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve));
      dom.update();
      wrapper = getRendered(PageSelect, dom);
    });
  });

  test('should render component', () => {
    expect(wrapper.type()).not.toBeNull();
  });

  test('should render section buttons', () => {
    // 5 regular buttons
    const buttons = wrapper.find(ButtonBase);
    expect(buttons.length).toBe(5);

    expect(wrapper.find(IconPageRegion)).not.toBeNull();
    expect(wrapper.find(IconPageElectricity)).not.toBeNull();
    expect(wrapper.find(IconPageOilAndGas)).not.toBeNull();
    expect(wrapper.find(IconPageScenarios)).not.toBeNull();
    expect(wrapper.find(IconPageSector)).not.toBeNull();
  });

  test('should select correct buttons', () => {
    const buttons = wrapper.find('.Mui-disabled');
    expect(expect.arrayContaining(buttons.map(btn => btn.text()))).toEqual(['By Region']);
  });

  test('buttons should be clickable', () => {
    const button = wrapper.findWhere(node => node.type() === 'button' && node.text() === 'Scenarios');
    button.simulate('click');
  });
});

// #endregion
