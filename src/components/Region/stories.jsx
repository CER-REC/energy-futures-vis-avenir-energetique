import React from 'react';
import { Grid } from '@material-ui/core';
import { storiesForComponent } from '../../../.storybook/utils';
import Region from './index';
import ReadMe from './README.md';

storiesForComponent('Components|Region', module, ReadMe)
  .add('default', () => (
    <Grid container style={{ padding: 16 }}>
      <Region width={200} />
    </Grid>
  ));
