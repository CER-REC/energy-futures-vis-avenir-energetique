import React from 'react';
import { Grid } from '@material-ui/core';
import { storiesForComponent } from '../../../.storybook/utils';
import ControlHorizontal from './index';
import ReadMe from './README.md';

storiesForComponent('Components|Lower Horizontal Control', module, ReadMe)
  .add('default', () => <Grid container style={{ padding: 16 }}><ControlHorizontal /></Grid>);
