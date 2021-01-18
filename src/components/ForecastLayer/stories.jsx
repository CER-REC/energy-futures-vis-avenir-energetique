import React from 'react';

import { storiesForComponent } from '../../../.storybook/utils';
import ForecastLayer from '.';
import ReadMe from './README.md';

storiesForComponent('Components|ForecastLayer', module, ReadMe)
  .add('Default', () => (
    <svg height={200} width={500}>
      <ForecastLayer
        height={200}
        innerHeight={200}
        innerWidth={500}
        margin={{ top: 0 }}
        xScale={year => (year === 1 ? 100 : 500)}
        forecastStart={1}
        forecastLabel="start"
      />
    </svg>
  ));
