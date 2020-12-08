import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ClickAwayListener, Typography, Button } from '@material-ui/core';

import LinkButtonGroup from '.';
import { LinkButtonContentMethodology, LinkButtonContentAbout, LinkButtonContentReport } from './contents';
import { TestContainer, getRendered } from '../../tests/utilities';
import { NOOP } from '../../utilities/parseData';

const DEFAULT_CONFIG = {
  page: 'by-sector',
  mainSelection: 'energyDemand',
  yearId: '2020',
  scenarios: ['Evolving'],
  view: 'region',
};

const BUTTONS = [
  'EF2020 Report',
  'Summary',
  'Key Findings',
  'Assumptions',
  'Results',
  'Methodology',
  'About',
];

const getComponent = (children, props) => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
    {children}
  </TestContainer>
);

describe('Component|LinkButtonGroup', () => {
  let wrapper;

  /**
   * Vertical layout
   */
  describe('Test vertical button layout', () => {
    beforeEach(async () => {
      const dom = mount(getComponent(<LinkButtonGroup />));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(LinkButtonGroup, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render vertical layout', () => {
      // column
      expect(wrapper.find('.MuiGrid-container').at(0).hasClass('MuiGrid-direction-xs-column')).toBeTruthy();

      // title shows in the vertical layout
      expect(wrapper.findWhere(node => node.type() === Typography && node.text() === 'Context').exists()).toBeTruthy();

      // verify all buttons
      expect(wrapper.find(Button).map(btn => btn.text()).filter(Boolean)).toEqual(BUTTONS);
    });

    test('should render button events', async () => {
      await act(async () => {
        wrapper.findWhere(node => node.type() === Button && node.text() === 'EF2020 Report').at(0).prop('onClick')();
        wrapper.findWhere(node => node.type() === Button && node.text() === '').at(0).prop('onClick')();
        wrapper.find(ClickAwayListener).at(0).prop('onClickAway')();
      });
    });
  });

  /**
   * Horizontal layout
   */
  describe('Test horizontal button layout', () => {
    beforeEach(async () => {
      const dom = mount(getComponent(<LinkButtonGroup direction="row" />));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(LinkButtonGroup, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });

    test('should render horizontal layout', () => {
      // row
      expect(wrapper.find('.MuiGrid-container').at(0).hasClass('MuiGrid-direction-xs-column')).toBeFalsy();

      // title does not show in the horizontal layout
      expect(wrapper.findWhere(node => node.type() === Typography && node.text() === 'Context').exists()).toBeFalsy();
    });
  });

  /**
   * LinkButtonContentMethodology
   */
  describe('Test LinkButtonContentMethodology', () => {
    beforeEach(async () => {
      const dom = mount(getComponent(<LinkButtonContentMethodology onClose={NOOP} />));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(LinkButtonContentMethodology, dom);
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();
    });
  });

  /**
   * LinkButtonContentAbout
   */
  describe('Test LinkButtonContentAbout', () => {
    test('should render component', async () => {
      const dom = mount(getComponent(<LinkButtonContentAbout onClose={NOOP} />));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(LinkButtonContentAbout, dom);
      });

      expect(wrapper.type()).not.toBeNull();
    });
  });

  /**
   * LinkButtonContentReport
   */
  describe('Test LinkButtonContentReport', () => {
    test('should render component', async () => {
      const dom = mount(getComponent(<LinkButtonContentReport yearId="2020" onClose={NOOP} />));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        dom.update();
        wrapper = getRendered(LinkButtonContentReport, dom);
      });

      expect(wrapper.type()).not.toBeNull();
    });

    test('should render tab buttons', async () => {
      await act(async () => {
        wrapper.findWhere(node => node.type() === Button && node.text() === 'Summary').at(0).prop('onClick')();
      });
      await act(async () => {
        wrapper.findWhere(node => node.type() === Button && node.text() === 'Key Findings').at(0).prop('onClick')();
      });
      await act(async () => {
        wrapper.findWhere(node => node.type() === Button && node.text() === 'Assumptions').at(0).prop('onClick')();
      });
      await act(async () => {
        wrapper.findWhere(node => node.type() === Button && node.text() === 'Results').at(0).prop('onClick')();
      });
    });
  });
});
