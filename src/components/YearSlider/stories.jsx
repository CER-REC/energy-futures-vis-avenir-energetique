import React from 'react';
import { Grid } from '@material-ui/core';
import { storiesForComponent } from '../../../.storybook/utils';
import YearSlider from './index';
import ReadMe from './README.md';

storiesForComponent('Components|YearSlider', module, ReadMe)
  .add('default', () => (
    <Grid container style={{ padding: 16 }}>
      <YearSlider />
    </Grid>
  ));
