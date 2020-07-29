import React from 'react';
import { Grid } from '@material-ui/core';
import { storiesForComponent } from '../../../.storybook/utils';
import PageSelect from './index';
import ReadMe from './README.md';

storiesForComponent('Components|Page Select', module, ReadMe)
  .add('default', () => <Grid container style={{ padding: 16 }}><PageSelect /></Grid>);
