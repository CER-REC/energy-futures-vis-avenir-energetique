import React from 'react';
import { shallow } from 'enzyme';
import { shouldBehaveLikeAComponent } from '../../tests/utilities';

import Nav from './index';

describe('Components|Nav', () => {
  describe('with default props', () => {
    const wrapper = shallow(<Nav tab={0} />);

    shouldBehaveLikeAComponent(Nav, () => wrapper);
  });
});
