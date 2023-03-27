import React from 'react';
import { getRendered, mountWithIntl } from '../../tests/utilities';
import UnsupportedWarning from '.';

describe('Components|UnsupportedWarning', () => {
  test('should render component', async () => {
    const wrapper = mountWithIntl(<UnsupportedWarning />);

    expect(getRendered(UnsupportedWarning, wrapper).exists()).toBeTruthy();
  });
});
