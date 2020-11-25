import React from 'react';
import { shallow } from 'enzyme';

import TranslatedParagraphs from '.';

const text = `Midway upon the journey of our life
I found myself within a forest dark,
For the straightforward pathway had been lost.`;

describe('Component|TranslatedParagraphs', () => {
  describe('default', () => {
    const wrapper = shallow(
      <TranslatedParagraphs>
        {text}
      </TranslatedParagraphs>,
    );

    test('should split text', () => {
      expect(wrapper).toHaveLength(3);
      expect(wrapper.first().type()).toBe('p');
    });
  });
});
