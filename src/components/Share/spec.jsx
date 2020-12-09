import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Button } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import { Share, DownloadButton } from '.';
import { TestContainer, getRendered } from '../../tests/utilities';
import { IconTwitter, IconFacebook, IconLinkedIn } from '../../icons';

const DEFAULT_CONFIG = {
  mainSelection: 'energyDemand',
  yearId: '2020',
  provinces: ['AB'],
  scenarios: ['Evolving'],
  view: 'region',
  unit: 'petajoules',
  provinceOrder: [
    'YT',
    'SK',
    'QC',
    'PE',
    'ON',
    'NU',
    'NT',
    'NS',
    'NL',
    'NB',
    'MB',
    'BC',
    'AB',
  ],
};

const getShareComponent = (props, options = {}) => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
    <Share {...options} />
  </TestContainer>
);

const getDownloadComponent = (props, options = {}) => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
    <DownloadButton {...options} />
  </TestContainer>
);

describe('Component| Share Buttons', () => {
  let wrapper;

  beforeEach(async () => {
    const dom = mount(getShareComponent({ page: 'by-region' }));
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve));
      dom.update();
      wrapper = getRendered(Share, dom);
    });
  });

  //

  test('should render component', () => {
    expect(wrapper.type()).not.toBeNull();
  });

  test('should render share buttons', () => {
    const buttons = wrapper.find(Button);
    expect(buttons.length).toBe(5);
    expect(wrapper.find(IconTwitter)).not.toBeNull();
    expect(wrapper.find(IconFacebook)).not.toBeNull();
    expect(wrapper.find(IconLinkedIn)).not.toBeNull();
    expect(wrapper.find(IconTwitter)).not.toBeNull();
    expect(wrapper.find(EmailIcon)).not.toBeNull();
  });

  test('should open correct item', () => {
    // look for the 'help' icon button
    const iconButtons = wrapper.find(Button);
    expect(iconButtons.length).toBe(5);

    iconButtons.forEach((button) => {
      expect(button.prop('onClick')).not.toBeNull();

      button.simulate('click');
    });
  });
});

describe('Component| Download Button', () => {
  let wrapper;

  beforeEach(async () => {
    const dom = mount(getDownloadComponent({ page: 'by-region' }));
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve));
      dom.update();
      wrapper = getRendered(DownloadButton, dom);
    });
  });

  //

  test('should render component', () => {
    expect(wrapper.type()).not.toBeNull();
  });

  test('should render text', () => {
    const button = wrapper.find(Button);

    expect(button.length).toBe(1);
    expect(button.text()).toBe('Download Data');
  });

  // test('should be clickable', () => {
  //   const button = wrapper.find(Button);
  //   button.simulate('click');
  // });
});
