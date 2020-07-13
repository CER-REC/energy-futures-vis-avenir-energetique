import React from 'react';
import { storiesForComponent } from '../../../.storybook/utils';
import PageLayot from './index';
import ReadMe from './README.md';

storiesForComponent('Components|PageLayout', module, ReadMe)
  .add('default', () => <PageLayot />);
