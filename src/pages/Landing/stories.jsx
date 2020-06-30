import React from 'react';
import { storiesForComponent } from '../../../.storybook/utils';
import Landing from './index';
import ReadMe from './README.md';

storiesForComponent('Pages|Landing Page', module, ReadMe)
  .add('default', () => <Landing />);
