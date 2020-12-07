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
  let wrapper;

  beforeEach(async () => {
    const dom = mount(getComponent());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve));
      dom.update();
      wrapper = getRendered(MaxTick, dom);
    });
  });

  test('should render component', () => {
    expect(wrapper.type()).not.toBeNull();
    expect(wrapper.findWhere(node => node.type() === 'tspan' && node.text() === '10000')).not.toBeNull();
    expect(wrapper.findWhere(node => node.type() === 'tspan' && node.text() === 'Mboe/d')).not.toBeNull();
  });
});
