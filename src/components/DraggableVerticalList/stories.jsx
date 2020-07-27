import React from 'react';
import { Grid } from '@material-ui/core';
import { storiesForComponent } from '../../../.storybook/utils';
import DraggableVerticalList from './index';
import ReadMe from './README.md';
import { REGIONS, REGION_ORDER, SOURCES, SOURCE_ORDER } from '../../types';

storiesForComponent('Components|DraggableVerticalList', module, ReadMe)
  .add('default', () => (
    <Grid container wrap="nowrap" spacing={2} style={{ margin: 16 }}>
      <Grid item>
        <DraggableVerticalList
          title="Region" left
          items={REGION_ORDER}
          itemOrder={REGION_ORDER}
          defaultItems={REGIONS}
          defaultItemOrder={REGION_ORDER}
        />
      </Grid>
      <Grid item>
        <DraggableVerticalList
          title="Source" round
          items={SOURCE_ORDER}
          itemOrder={SOURCE_ORDER}
          defaultItems={SOURCES}
          defaultItemOrder={SOURCE_ORDER}
        />
      </Grid>
    </Grid>
  ));
