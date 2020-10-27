import React from 'react';
import { Grid } from '@material-ui/core';
import { withKnobs, number } from '@storybook/addon-knobs';
import withInteraction, { getInteractionProps } from 'storybook-addon-interaction';

import { storiesForComponent } from '../../../.storybook/utils';
import YearSlider from './index';
import ReadMe from './README.md';

storiesForComponent('Components|YearSlider', module, ReadMe)
  .addDecorator(withKnobs)
  .addDecorator(
    withInteraction({
      state: { year: 2010 },
      actions: {
        onYearChange: () => year => ({ year }),
      },
    }),
  )
  .add('default', () => (
    <Grid container style={{ padding: 16 }}>
      <YearSlider
        {...getInteractionProps()}
        min={number('Start', 2000)}
        max={number('End', 2050)}
        forecast={number('Forecast Year', 2020)}
      />
    </Grid>
  ));
