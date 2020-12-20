import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { Grid, Button, ButtonBase, Dialog } from '@material-ui/core';

import Landing from '.';
import analytics from '../../analytics';
import { TestContainer } from '../../tests/utilities';

const DEFAULT_CONFIG = {
  page: 'landing',
  yearId: '2020',
};

const spyAnalytics = jest.spyOn(analytics, 'reportNav');

const getComponent = (desktop /* boolean */) => {
  global.matchMedia = media => ({
    addListener: () => {},
    removeListener: () => {},
    matches: desktop && media === '(min-width: 992px)',
  });
  return (
    <TestContainer mockConfig={{ ...DEFAULT_CONFIG }}>
      <Landing />
    </TestContainer>
  );
};

describe('Component|Landing', () => {
  let wrapper;

  describe('Test base component', () => {
    beforeEach(async () => {
      wrapper = mount(getComponent());
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();

      // verify mobile layout
      expect(wrapper.find('aside').prop('style').width).toEqual('30%');
      expect(wrapper.find('aside').find(Grid).at(0).prop('spacing')).toEqual(3);
      expect(wrapper.find('main').prop('style').width).toEqual('65%');
    });

    test('should render page portals', async () => {
      // 5 page portal links
      expect(wrapper.find('main').find(ButtonBase)).toHaveLength(5);

      await act(async () => {
        wrapper.find('main').find(ButtonBase).at(0).prop('onClick')();
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();

        // verify the page portal link has been triggered
        expect(spyAnalytics).toBeCalled();
      });
    });

    test('should render buttons & links', async () => {
      // verify links
      expect(wrapper.findWhere(node => node.type() === Button && node.text() === 'About').exists()).toBeTruthy();
      expect(wrapper.findWhere(node => node.type() === 'a' && node.text() === 'Methodology').exists()).toBeTruthy();
      expect(wrapper.findWhere(node => node.type() === 'a' && node.text() === 'Student Resources').exists()).toBeTruthy();
      expect(wrapper.find('aside').find('a')).toHaveLength(4);

      await expect(await act(async () => {
        // about dialog is close by default
        expect(wrapper.find(Dialog).prop('open')).toBeFalsy();

        // click the 'about' button to open the about dialog
        wrapper.findWhere(node => node.type() === Button && node.text() === 'About').prop('onClick')();
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(wrapper.find(Dialog).prop('open')).toBeTruthy();

        // click the close icon to close the about dialog
        wrapper.find(Dialog).at(0).prop('onClose')();
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(wrapper.find(Dialog).prop('open')).toBeFalsy();
      }));
    });
  });

  describe('Test desktop mode', () => {
    beforeEach(async () => {
      wrapper = mount(getComponent(true));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      });
    });

    test('should render component', () => {
      expect(wrapper.type()).not.toBeNull();

      // verify desktop layout
      expect(wrapper.find('aside').prop('style').width).toEqual('20%');
      expect(wrapper.find('aside').find(Grid).at(0).prop('spacing')).toEqual(6);
      expect(wrapper.find('main').prop('style').width).toEqual('75%');
    });
  });
});
