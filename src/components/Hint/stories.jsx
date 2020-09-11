import React from 'react';
import { Grid } from '@material-ui/core';
import { storiesForComponent } from '../../../.storybook/utils';
import Hint from './index';
import ReadMe from './README.md';

storiesForComponent('Components|Hint', module, ReadMe)
  .add('default', () => <Grid container style={{ padding: 16 }}><Hint /></Grid>);
