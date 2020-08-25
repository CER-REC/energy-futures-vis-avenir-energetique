import React from 'react';
import { Grid } from '@material-ui/core';
import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import HorizontalControlBar from './index';
import ReadMe from './README.md';

storiesForComponent('Components|Horizontal Control Bar', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .add('default', () => <Grid container style={{ padding: 16 }}><HorizontalControlBar /></Grid>);
