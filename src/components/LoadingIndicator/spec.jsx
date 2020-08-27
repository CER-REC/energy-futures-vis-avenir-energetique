import React from 'react';

import { mountWithIntl, shouldBehaveLikeAComponent } from '../../tests/utilities';
import LoadingIndicator from './index';

describe('Components|LoadingIndicator', () => {
  describe('with default props', () => {
    const wrapper = mountWithIntl(<LoadingIndicator type="api" />);

    shouldBehaveLikeAComponent(LoadingIndicator, () => wrapper);
  });
});
