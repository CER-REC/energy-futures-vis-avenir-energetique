import React from 'react';
import { Grid } from '@material-ui/core';
import { storiesForComponent } from '../../../.storybook/utils';
import Control from './index';
import ReadMe from './README.md';

storiesForComponent('Components|Control', module, ReadMe)
  .add('default', () => (
    <Grid container style={{ padding: 16 }}>
      <Control width={200} />
    </Grid>
  ));
