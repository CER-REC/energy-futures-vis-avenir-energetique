import React from 'react';
import { Grid } from '@material-ui/core';
import { storiesForComponent } from '../../../.storybook/utils';
import YearSlider from './index';
import ReadMe from './README.md';

storiesForComponent('Components|YearSlider', module, ReadMe)
  .add('default', () => (
    <Grid container style={{ padding: 16 }}>
      <YearSlider year={2020} min={2000} max={2050} />
    </Grid>
  ));
