import React from 'react';
import { storiesForComponent } from '../../../.storybook/utils';
import ReadMe from './README.md';
import SunBurstChart from './index';

storiesForComponent('Pages|Demand', module, ReadMe)
  .add('default', () => <SunBurstChart />);
