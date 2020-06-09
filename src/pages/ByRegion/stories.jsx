import React from 'react';
import { storiesForComponent } from '../../../.storybook/utils';
import ByRegion from './index';
import ReadMe from './README.md';

storiesForComponent('Pages|ByRegion', module, ReadMe)
  .add('default', () => <ByRegion />);
