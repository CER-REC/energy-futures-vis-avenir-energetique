import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesForComponent } from '../../../.storybook/utils';
import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import LinkButtonGroup from './index';
import ReadMe from './README.md';

const DEFAULT_CONFIG = {
  page: 'by-sector',
  mainSelection: 'energyDemand',
  yearId: '2020',
  scenarios: ['Evolving'],
  view: 'region',
  provinces: [],
};

storiesForComponent('Components|LinkButtonGroup', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .addParameters({ mockConfigBasic: DEFAULT_CONFIG })
  .addDecorator(withKnobs)
  .add('default', () => (
    <LinkButtonGroup />
  ));
