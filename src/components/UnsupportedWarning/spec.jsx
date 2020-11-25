import React from 'react';
import { shallow } from 'enzyme';
import { shouldBehaveLikeAComponent } from '../../tests/utilities';

import UnsupportedWarning from '.';

describe('Components|UnsupportedWarning', () => {
  describe('with default props', () => {
    const wrapper = shallow(<UnsupportedWarning type="resolution" />);

    shouldBehaveLikeAComponent(UnsupportedWarning, () => wrapper);
  });
});
