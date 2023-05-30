import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Button } from '@material-ui/core';
import ScenarioSelect from '.';
import { TestContainer, getRendered } from '../../tests/utilities';
import { HintMainSelect } from '../Hint';

const DEFAULT_CONFIG = {
  mainSelection: 'energyDemand',
  yearId: '2017',
  scenarios: ['Evolving'],
  view: 'region',
};

const getComponent = (props, options = {}) => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
    <ScenarioSelect {...options} />
  </TestContainer>
);

describe('Component|PageSelect', () => {
  let wrapper;

  // #region Generic Tests
  describe('Test Generic Case', () => {
    beforeEach(async () => {
      const dom = mount(getComponent({ page: 'by-region' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(ScenarioSelect, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render section buttons', () => {
      expect(wrapper.find(HintMainSelect)).not.toBeNull();

      // scenario buttons for 2020 report year
      const buttons = wrapper.find(Button);
      expect(buttons.length).toBe(4);
      expect(expect.arrayContaining(buttons.map(btn => btn.text()))).toEqual(['Reference', 'Higher Carbon Price', 'Technology', 'Read less']);
    });

    test('buttons should be clickable', () => {
      const button = wrapper.findWhere(node => node.type() === 'button' && node.text() === 'Reference');
      button.simulate('click');
    });
  });
  // #endregion

  // #region Special Cases
  describe('Test Special Cases', () => {
    beforeEach(async () => {
      const dom = mount(getComponent(
        {
          page: 'by-region',
          mainSelection: 'scenarios',
          yearId: 2020,
          scenarios: ['Reference', 'Evolving'],
        },
        { multiSelect: true },
      ));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(ScenarioSelect, dom);
      });
    });

    test('should include evolving', () => {
      const buttons = wrapper.find(Button);
      expect(buttons.map(btn => btn.text())).toContain('Evolving');
    });

    test('buttons should be clickable', () => {
      const button = wrapper.findWhere(node => node.type() === 'button' && node.text() === 'Evolving');
      button.simulate('click');
    });

    test('should have multiple selected', () => {
      const buttons = new Set(wrapper.find('.MuiButton-contained'));
      expect(buttons.size).toBeGreaterThan(2);
    });
  });
  // #endregion
});
