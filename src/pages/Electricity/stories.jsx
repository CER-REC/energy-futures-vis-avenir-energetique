import React from 'react';
import { storiesForComponent } from '../../../.storybook/utils';
import Electricity from './index';
import ReadMe from './README.md';

storiesForComponent('Pages|Electricity', module, ReadMe)
  .add('default', () => <Electricity />);
