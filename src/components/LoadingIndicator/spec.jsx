import React from 'react';
import { shallow } from 'enzyme';
import { shouldBehaveLikeAComponent } from '../../tests/utilities';

import LoadingIndicator from './index';

describe('Components|LoadingIndicator', () => {
  describe('with default props', () => {
    const wrapper = shallow(<LoadingIndicator />);

    shouldBehaveLikeAComponent(LoadingIndicator, () => wrapper);
  });
});
