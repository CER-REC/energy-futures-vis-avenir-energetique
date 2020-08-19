import React from 'react';
import { Grid } from '@material-ui/core';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { storiesForComponent } from '../../../.storybook/utils';
import ScenarioSelect from './index';
import ReadMe from './README.md';

storiesForComponent('Components|Scenario Select', module, ReadMe)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Grid container style={{ padding: 16 }}>
      <ScenarioSelect multiSelect={boolean('Multi-Select', false)} />
    </Grid>
  ));
