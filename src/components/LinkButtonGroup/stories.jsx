import React from 'react';
import { withKnobs, radios } from '@storybook/addon-knobs';
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
};

storiesForComponent('Components|LinkButtonGroup', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .addParameters({ mockConfigBasic: DEFAULT_CONFIG })
  .addDecorator(withKnobs)
  .add('default', () => (
    <LinkButtonGroup direction={radios('Direction', { Column: 'column', Row: 'row' }, 'column')} />
  ));
