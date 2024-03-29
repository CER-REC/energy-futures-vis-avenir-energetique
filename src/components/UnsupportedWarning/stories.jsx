import React from 'react';
import { storiesForComponent } from '../../../.storybook/utils';
import UnsupportedWarning from '.';
import ReadMe from './README.md';

storiesForComponent('Components|UnsupportedWarning', module, ReadMe)
  .add('browser', () => (
    <UnsupportedWarning />
  ));
