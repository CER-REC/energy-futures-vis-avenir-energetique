import React from 'react';
import { Typography } from '@material-ui/core';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import PageLayout from './index';
import ReadMe from './README.md';

storiesForComponent('Components|PageLayout', module, ReadMe)
  .addDecorator(withKnobs)
  .addParameters({
    mockConfigBasic: {
      page: 'by-sector',
      mainSelection: 'energyDemand',
      yearId: '2020',
      scenarios: ['Evolving'],
      sector: 'ALL',
      view: 'region',
      unit: 'petajoules',
      provinces: ['ALL'],
      provinceOrder: ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'],
      sources: ['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL'],
      sourceOrder: ['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL'],
    },

    /**
     * TODO: ignore this component in storyshots due to a known React Portal issue in testing:
     * https://github.com/reactjs/react-modal/issues/553
     */
    storyshots: { disable: true },
  })
  .addDecorator(withConfigAndGQL)
  .add('default', () => (
    <PageLayout
      showRegion={boolean('Show Region List', false)}
      showSource={boolean('Show Source List', false)}
      disableDraggableRegion={boolean('Disable Region List Drag-n-Drop', false)}
      disableDraggableSource={boolean('Disable Source List Drag-n-Drop', false)}
      singleSelectRegion={boolean('Single-Select in Region List', false)}
      singleSelectSource={boolean('Single-Select in Source List', false)}
    >
      <Typography variant="h6">Viz</Typography>
    </PageLayout>
  ));
