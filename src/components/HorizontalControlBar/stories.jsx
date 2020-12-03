import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import HorizontalControlBar from './index';
import ReadMe from './README.md';

storiesForComponent('Components|HorizontalControlBar', module, ReadMe)
  .addDecorator(withKnobs)
  .addParameters({
    mockConfigBasic: {
      page: 'by-region',
      mainSelection: 'energyDemand',
      yearId: '2020',
      scenarios: ['Evolving'],
      view: 'region',
    },
  })
  .addDecorator(withConfigAndGQL)
  .add('By Region', () => <HorizontalControlBar />)
  .addParameters({ mockConfigExtra: { page: 'by-sector' } })
  .add('By Sector', () => <HorizontalControlBar />)
  .addParameters({ mockConfigExtra: { page: 'electricity', mainSelection: 'electricityGeneration' } })
  .add('Electricity', () => <HorizontalControlBar />)
  .addParameters({ mockConfigExtra: { page: 'scenarios' } })
  .add('Scenarios', () => <HorizontalControlBar />)
  .addParameters({ mockConfigExtra: { page: 'oil-and-gas', mainSelection: 'oilProduction' } })
  .add('Oil and Gas', () => <HorizontalControlBar />);
