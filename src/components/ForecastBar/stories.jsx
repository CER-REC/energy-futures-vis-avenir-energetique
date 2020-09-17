import React from 'react';
import { Grid } from '@material-ui/core';
import { withKnobs, number } from '@storybook/addon-knobs';
import { storiesForComponent } from '../../../.storybook/utils';
import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import ForecastBar from './index';
import ReadMe from './README.md';

storiesForComponent('Components|ForecastBar', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .addDecorator(withKnobs)
  .add('default', () => {
    const year = { min: number('min', 2005), max: number('max', 2050) };
    return <Grid container style={{ padding: 16 }}><ForecastBar year={year} /></Grid>;
  });
