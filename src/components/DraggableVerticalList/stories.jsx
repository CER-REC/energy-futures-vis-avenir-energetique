import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import { withKnobs, boolean, number, radios } from '@storybook/addon-knobs';

import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import DraggableVerticalList from './index';
import ReadMe from './README.md';

const textItems = {
  a: { color: '#1C7F24', label: 'A Label' },
  b: { color: '#4B5E5B', label: 'B Label' },
  c: { color: '#7ACBCB' },
};

const iconItems = {
  d: { color: '#890038', icon: FlashOnIcon },
  e: { color: '#FF821E', icon: DataUsageIcon },
};

storiesForComponent('Components|DraggableVerticalList', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Grid container wrap="nowrap" spacing={2}>
      <Grid item><Typography variant="body2">Interactive:</Typography></Grid>
      <Grid item>
        <DraggableVerticalList
          width={number('Width', 64)}
          round={radios('Shape', { Round: 'round', Square: 'square' }, 'round') === 'round'}
          dense={boolean('Dense', true)}
          singleSelect={boolean('Single-Select', false)}
          disabled={radios('Drag-n-Drop', { Enabled: 'enabled', Disabled: 'disabled' }, 'enabled') === 'disabled'}
          items={Object.keys(textItems)}
          itemOrder={Object.keys(textItems)}
          defaultItems={textItems}
          defaultItemOrder={Object.keys(textItems)}
        />
      </Grid>
      <Grid item><Typography variant="body2">Static:</Typography></Grid>
      <Grid item>
        <DraggableVerticalList
          width={64}
          round
          items={Object.keys(iconItems)}
          itemOrder={Object.keys(iconItems)}
          defaultItems={iconItems}
          defaultItemOrder={Object.keys(iconItems)}
        />
      </Grid>
    </Grid>
  ));
