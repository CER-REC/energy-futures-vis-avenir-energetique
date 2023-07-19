import React from 'react';

import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import Electricity from './index';
import ReadMe from './README.md';

let DEFAULT_CONFIG;
export default DEFAULT_CONFIG = {
  page: 'electricity',
  yearId: '2023',
  view: 'region',
  unit: 'petajoules',
  provinces: ['ON', 'NB'],
  provinceOrder: ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'],
  sources: ['COAL', 'HYDRO', 'NUCLEAR'],
  sourceOrder: ['COAL', 'HYDRO', 'NUCLEAR'],
  scenarios: ['Global Net-zero'],
};

const getComponent = () => (
  <div style={{ height: 500, width: '100%' }}>
    <Electricity />
  </div>
);

const STORYBOOK_CONFIG_MULTIPLE = {
  ...DEFAULT_CONFIG,
  provinces: ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'],
};

storiesForComponent('Pages|Electricity', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .addParameters({ mockConfigBasic: STORYBOOK_CONFIG_MULTIPLE })
  .add('multiple bubbles', () => getComponent())
  .addParameters({ mockConfigExtra: { provinces: ['ON'] } })
  .add('single bubble', () => getComponent());
