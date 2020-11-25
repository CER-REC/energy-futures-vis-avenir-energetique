import React from 'react';
import { Grid } from '@material-ui/core';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import ScenarioSelect from './index';
import ReadMe from './README.md';

storiesForComponent('Components|ScenarioSelect', module, ReadMe)
  .addDecorator(withKnobs)
  .addDecorator(withConfigAndGQL)
  .add('default', () => (
    <Grid container style={{ padding: 16 }}>
      <ScenarioSelect multiSelect={boolean('Multi-Select', false)} />
    </Grid>
  ));
