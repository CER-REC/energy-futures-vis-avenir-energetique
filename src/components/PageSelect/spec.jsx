import React from 'react';
import { shallow, mount } from 'enzyme';
import { PageSelect, PageTitle } from './index';

describe('PageSelect', () => {
  test('should set default direction to column', () => {
    const pageSelect = <PageSelect />;

    expect(pageSelect.props).toStrictEqual({ direction: 'column' });
  });
});

describe('PageTitle', () => {
  test('should check page title is page title', () => {
    const pageTitle = <PageTitle />;

    expect(pageTitle.type).toBe(PageTitle);
  });
});
