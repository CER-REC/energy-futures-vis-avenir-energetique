import React from 'react';
import { Grid } from '@material-ui/core';
import { storiesForComponent } from '../../../.storybook/utils';
import VizTooltip from './index';
import ReadMe from './README.md';

storiesForComponent('Components|VizTooltip', module, ReadMe)
  .add('default', () => <Grid container style={{ padding: 16 }}><VizTooltip nodes={[]} unit="" /></Grid>);
