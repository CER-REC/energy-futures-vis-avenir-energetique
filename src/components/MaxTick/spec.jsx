import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import MaxTick from '.';
import { TestContainer, getRendered } from '../../tests/utilities';

const getComponent = () => (
  <TestContainer>
    <svg><MaxTick value={10000} unit="kilobarrelEquivalents" /></svg>
  </TestContainer>
);

describe('Component|MaxTick', () => {
  const dom = mount(getComponent());

  test('should render component', async () => {
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve));
      dom.update();
      const wrapper = getRendered(MaxTick, dom);

      expect(wrapper.type()).not.toBeNull();
      expect(wrapper.findWhere(node => node.type() === 'tspan' && node.text() === '10000').exists()).toBeTruthy();
      expect(wrapper.findWhere(node => node.type() === 'tspan' && node.text() === 'Mboe/d').exists()).toBeTruthy();
    });
  });
});
