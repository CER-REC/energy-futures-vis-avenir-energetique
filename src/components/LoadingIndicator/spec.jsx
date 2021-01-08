import React from 'react';
import { getRendered, mountWithIntl } from '../../tests/utilities';
import LoadingIndicator from './index';

describe('Components|LoadingIndicator', () => {
  test('should render component', () => {
    const wrapper = mountWithIntl(<LoadingIndicator type="api" />);

    expect(getRendered(LoadingIndicator, wrapper).exists()).toBeTruthy();
  });
});
