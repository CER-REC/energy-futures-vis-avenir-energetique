import React from 'react';
import { storiesForComponent } from '../../../.storybook/utils';
import ByScenario from './index';
import ReadMe from './README.md';

storiesForComponent('Pages|ByScenario', module, ReadMe)
  .add('default', () => <ByScenario />);
