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
   * Horizontal layout
   */
  describe('Test horizontal button layout', () => {
    beforeEach(async () => {
      wrapper = mount(getComponent(<LinkButtonGroup/>));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(getRendered(LinkButtonGroup, wrapper).type()).not.toBeNull();
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
    test('should render component', async () => {
      wrapper = mount(getComponent(<LinkButtonContentMethodology onClose={NOOP} />));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });

      expect(getRendered(LinkButtonContentMethodology, wrapper).type()).not.toBeNull();
    });
  });

  /**
   * LinkButtonContentAbout
   */
  describe('Test LinkButtonContentAbout', () => {
    test('should render component', async () => {
      wrapper = mount(getComponent(<LinkButtonContentAbout onClose={NOOP} />));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });

      expect(getRendered(LinkButtonContentAbout, wrapper).type()).not.toBeNull();
    });
  });

  /**
   * LinkButtonContentReport
   */
  describe('Test LinkButtonContentReport', () => {
    beforeEach(async () => {
      wrapper = mount(getComponent(<LinkButtonContentReport yearId="2020" onClose={NOOP} />));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', async () => {
      expect(getRendered(LinkButtonContentReport, wrapper).type()).not.toBeNull();
    });

    test('should render tab buttons', async () => {
      const verifyTabClick = async label => act(async () => {
        const findButton = node => node.type() === Button && node.text() === label;
        expect(wrapper.findWhere(findButton).at(0).prop('disabled')).toBeFalsy();
        wrapper.findWhere(findButton).at(0).prop('onClick')();
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(wrapper.findWhere(findButton).at(0).prop('disabled')).toBeTruthy();
      });

      // iterate through tabs and verify the click event
      await verifyTabClick('Key Findings');
      await verifyTabClick('Assumptions');
      await verifyTabClick('Results');
      await verifyTabClick('Summary');
    });
  });
});
