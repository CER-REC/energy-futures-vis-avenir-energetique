import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { Button, ButtonBase, Dialog } from '@material-ui/core';

import Landing from '.';
import { TestContainer } from '../../tests/utilities';

const DEFAULT_CONFIG = {
  page: 'landing',
  yearId: '2020',
};

const getComponent = props => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
    <Landing />
  </TestContainer>
);

describe('Component|Landing', () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = mount(getComponent());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve));
      wrapper.update();
    });
  });

  test('should render component', () => {
    expect(wrapper.type()).not.toBeNull();
  });

  test('should render page portals', async () => {
    expect(wrapper.findWhere(node => node.type() === ButtonBase && node.prop('id') === 'page-portal-by-region').exists()).toBeTruthy();
    expect(wrapper.findWhere(node => node.type() === ButtonBase && node.prop('id') === 'page-portal-by-sector').exists()).toBeTruthy();
    expect(wrapper.findWhere(node => node.type() === ButtonBase && node.prop('id') === 'page-portal-electricity').exists()).toBeTruthy();
    expect(wrapper.findWhere(node => node.type() === ButtonBase && node.prop('id') === 'page-portal-scenarios').exists()).toBeTruthy();
    expect(wrapper.findWhere(node => node.type() === ButtonBase && node.prop('id') === 'page-portal-oil-and-gas').exists()).toBeTruthy();

    await expect(await act(async () => {
      wrapper.findWhere(node => node.type() === ButtonBase && node.prop('id') === 'page-portal-by-region').prop('onClick')();
    }));
  });

  test('should render buttons & links', async () => {
    expect(wrapper.findWhere(node => node.type() === Button && node.text() === 'About').exists()).toBeTruthy();
    expect(wrapper.findWhere(node => node.type() === 'a' && node.text() === 'Methodology').exists()).toBeTruthy();
    expect(wrapper.findWhere(node => node.type() === 'a' && node.text() === 'Student Resources').exists()).toBeTruthy();

    expect(wrapper.findWhere(node => node.type() === 'a' && node.prop('id') === 'button-download-report').exists()).toBeTruthy();
    expect(wrapper.findWhere(node => node.type() === 'a' && node.prop('id') === 'button-past-reports').exists()).toBeTruthy();

    await expect(await act(async () => {
      wrapper.findWhere(node => node.type() === Button && node.text() === 'About').prop('onClick')();
      wrapper.findWhere(node => node.type() === 'a' && node.prop('id') === 'button-download-report').prop('onClick')();
      wrapper.find(Dialog).at(0).prop('onClose')();
    }));
  });
});
