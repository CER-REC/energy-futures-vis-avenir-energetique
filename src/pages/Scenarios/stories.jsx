import React from 'react';
import { storiesForComponent } from '../../../.storybook/utils';
import Scenarios from './index';
import ReadMe from './README.md';

storiesForComponent('Pages|Scenarios', module, ReadMe)
  .add('default', () => <Scenarios />);
