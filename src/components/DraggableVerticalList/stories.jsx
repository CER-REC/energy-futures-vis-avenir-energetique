import React from 'react';
import { Grid } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import { withKnobs, boolean, number, text } from '@storybook/addon-knobs';

import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import DraggableVerticalList from './index';
import ReadMe from './README.md';

const textItems = {
  a: {
    color: 'red',
    label: 'A Label',
  },
  b: {
    color: '#A5610C',
    label: 'B Label',
  },
  c: {
    color: 'green',
  },
};

const iconItems = {
  d: {
    color: '#A5610C',
    icon: FlashOnIcon,
  },
  e: {
    color: blue,
    icon: DataUsageIcon,
  },
};

storiesForComponent('Components|DraggableVerticalList', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Grid container wrap="nowrap" spacing={2} style={{ margin: 16 }}>
      <Grid item>
        <DraggableVerticalList
          title={text('Title', 'Title')}
          width={number('Width', 62)}
          round={boolean('Round', true)}
          dense={boolean('Dense', true)}
          singleSelect={boolean('Single Selection', false)}
          disabled={boolean('Disabled', false)}
          items={Object.keys(textItems)}
          itemOrder={Object.keys(textItems)}
          defaultItems={textItems}
          defaultItemOrder={Object.keys(textItems)}
        />
      </Grid>
      <Grid item>
        <DraggableVerticalList
          title={text('Title')}
          width={70}
          round
          items={Object.keys(iconItems)}
          itemOrder={Object.keys(iconItems)}
          defaultItems={iconItems}
          defaultItemOrder={Object.keys(iconItems)}
        />
      </Grid>
    </Grid>
  ));
