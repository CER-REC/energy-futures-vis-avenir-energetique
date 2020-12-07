import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Typography, Button, IconButton } from '@material-ui/core';
import YearSelect from '.';
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
    <YearSelect {...options} />
  </TestContainer>
);

describe('Component| YearSelect', () => {
  let wrapper;
  // #region Generic Tests
  describe('Generic Tests', () => {
    beforeEach(async () => {
      const dom = mount(getComponent({ page: 'by-region' }));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(YearSelect, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render report title', () => {
      const titles = wrapper.find(Typography);
      expect(titles.length).toBe(2);
      expect(titles.map(title => title.text())).toContain('REPORT');
      expect(titles.map(title => title.text())).toContain('2017');
    });

    test('should render proper buttons', () => {
      // 1 'help' button
      const iconButtons = wrapper.find(IconButton);
      expect(iconButtons.length).toBe(1);

      expect(wrapper.find(HintMainSelect)).not.toBeNull();

      // 6 year buttons
      const buttons = wrapper.find(Button);
      expect(buttons.length).toBe(6);
    });

    test('should select correct year on load', () => {
      const buttons = wrapper.find('.MuiButton-containedPrimary').map(btn => btn.text());
      expect(new Set(buttons).size).toBe(1);
      expect(buttons).toContain('2017');
    });

    test('should have correct years', () => {
      const buttons = wrapper.find('.MuiButton-containedSecondary').map(button => button.text());

      expect(buttons).toContain('2016');
      expect(buttons).toContain('2016*');
      expect(buttons).not.toContain('2017');
      expect(buttons).toContain('2018');
      expect(buttons).toContain('2019');
      expect(buttons).toContain('2020');
    });

    test('buttons should be clickable', () => {
      const button = wrapper.findWhere(node => node.type() === 'button' && node.text() === '2019');
      button.simulate('click');
    });
  });
  // #endregion
});
