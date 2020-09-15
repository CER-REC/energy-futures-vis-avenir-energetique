import React from 'react';
import { Grid } from '@material-ui/core';
import { storiesForComponent } from '../../../.storybook/utils';
import LinkButtonGroup from './index';
import ReadMe from './README.md';

storiesForComponent('Components|LinkButtonGroup', module, ReadMe)
  .add('default', () => (
    <Grid container style={{ padding: 16 }}>
      <LinkButtonGroup labels={[['assumptions', 'results', 'report'], ['methodology', 'about']]} />
    </Grid>
  ));
