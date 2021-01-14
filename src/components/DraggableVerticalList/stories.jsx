import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { withKnobs, boolean, number, radios } from '@storybook/addon-knobs';

import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import DraggableVerticalList from './index';
import { IconGas, IconOil } from '../../icons';
import ReadMe from './README.md';

const DEFAULT_CONFIG = {
  page: 'electricity',
  mainSelection: 'energyDemand',
  yearId: '2020',
  scenarios: ['Evolving'],
  sector: 'TRANSPORTATION',
  view: 'region',
};

const textItems = {
  AB: { color: '#1C7F24', label: 'AB' },
  ON: { color: '#4B5E5B', label: 'ON' },
  BC: { color: '#7ACBCB', label: 'BC' },
};

const iconItems = {
  GAS: { color: '#890038', label: 'Natural Gas', icon: IconGas },
  OIL: { color: '#FF821E', label: 'Oil Products', icon: IconOil },
};

storiesForComponent('Components|DraggableVerticalList', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .addParameters({ mockConfigBasic: DEFAULT_CONFIG })
  .addDecorator(withKnobs)
  .add('default', () => (
    <Grid container wrap="nowrap" spacing={2}>
      <Grid item><Typography variant="body2">Interactive:</Typography></Grid>
      <Grid item>
        <DraggableVerticalList
          title="Region"
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
          sourceType="electricity"
          items={Object.keys(iconItems)}
          itemOrder={Object.keys(iconItems)}
          defaultItems={iconItems}
          defaultItemOrder={Object.keys(iconItems)}
        />
      </Grid>
    </Grid>
  ));
