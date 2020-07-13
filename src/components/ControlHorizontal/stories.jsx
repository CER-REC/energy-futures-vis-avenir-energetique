import React from 'react';
import { storiesForComponent } from '../../../.storybook/utils';
import ControlHorizontal from './index';
import ReadMe from './README.md';

storiesForComponent('Components|ControlHorizontal', module, ReadMe)
  .add('default', () => <ControlHorizontal />);
