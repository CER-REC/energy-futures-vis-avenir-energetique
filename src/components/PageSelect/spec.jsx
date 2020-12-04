import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Typography, ButtonBase } from '@material-ui/core';
import { PageSelect, PageTitle } from '.';
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

  test('should render page titles', () => {
    const titles = wrapper.find(Typography);
    const names = ['By Region', 'By Sector', 'Electricity', 'Scenarios', 'Oil and Gas'];
    expect(expect.arrayContaining(titles.map(title => title.text()))).toEqual(names);
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

// #region PageTitle

const getComponentTitle = props => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
    <PageTitle />
  </TestContainer>
);

describe('Component| PageTitle', () => {
  let wrapper;

  describe('Test By Region ', () => {
    beforeEach(async () => {
      const dom = mount(getComponentTitle({ page: 'by-region' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(PageTitle, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should have correct title', () => {
      const title = wrapper.find('.MuiTypography-h5');
      expect(title.text()).toBe('Total End-Use Demand By Region');
    });
  });

  describe('Test By Sector ', () => {
    beforeEach(async () => {
      const dom = mount(getComponentTitle({ page: 'by-sector' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(PageTitle, dom);
      });
    });

    test('should have correct title', () => {
      const title = wrapper.find('.MuiTypography-h5');
      expect(title.text()).toBe('By Sector');
    });
  });

  describe('Test Scenarios ', () => {
    beforeEach(async () => {
      const dom = mount(getComponentTitle({ page: 'scenarios' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(PageTitle, dom);
      });
    });

    test('should have correct title', () => {
      const title = wrapper.find('.MuiTypography-h5');
      expect(title.text()).toBe('Compare Scenarios For Total End-Use Demand');
    });
  });

  describe('Test Electricity ', () => {
    beforeEach(async () => {
      const dom = mount(getComponentTitle({ page: 'electricity' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(PageTitle, dom);
      });
    });

    test('should have correct title', () => {
      const title = wrapper.find('.MuiTypography-h5');
      expect(title.text()).toBe('Electricity Generation By Region');
    });
  });

  describe('Test Oil and Gas ', () => {
    beforeEach(async () => {
      const dom = mount(getComponentTitle({ page: 'oil-and-gas' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(PageTitle, dom);
      });
    });

    test('should have correct title', () => {
      const title = wrapper.find('.MuiTypography-h5');
      expect(title.text()).toBe('Oil and Gas');
    });
  });

  describe('Test Unknown Page ', () => {
    beforeEach(async () => {
      const dom = mount(getComponentTitle({ page: 'invalid' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(PageTitle, dom);
      });
    });

    test('should have correct title', () => {
      const title = wrapper.find('.MuiTypography-h5');
      expect(title.text()).toBe('');
    });
  });
});

describe('Test title doesnt exist', () => {
  let wrapper;

  beforeEach(async () => {
    const dom = mount(getComponentTitle({ page: 'mock-up' }));
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve));
      dom.update();
      wrapper = getRendered(PageTitle, dom);
    });
  });

  test('should NOT render title', () => {
    const title = wrapper.find('.MuiTypography-h5');
    expect(title.text()).toBeFalsy();
  });
});

// #endregion

