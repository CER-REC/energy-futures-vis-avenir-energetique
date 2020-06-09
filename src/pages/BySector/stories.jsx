import React from 'react';
import { storiesForComponent } from '../../../.storybook/utils';
import BySector from './index';
import ReadMe from './README.md';

storiesForComponent('Pages|BySector', module, ReadMe)
  .add('default', () => <BySector />);
