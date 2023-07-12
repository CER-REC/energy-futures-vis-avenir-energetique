import React from 'react';
import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import OilAndGas from './index';
import ReadMe from './README.md';

let DEFAULT_CONFIG;
export default DEFAULT_CONFIG = {
  page: 'oil-and-gas',
  yearId: '2020',
  mainSelection: 'oilProduction',
  scenarios: ['Evolving'],
  unit: 'kilobarrels',
  view: 'region',
  provinces: ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'],
  provinceOrder: ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'],
  sources: ['C5', 'CONDENSATE', 'HEAVY', 'ISB', 'LIGHT', 'MB'],
  baseYear: 2005,
  compareYear: 2006,
  noCompare: false,
};

storiesForComponent('Pages|OilAndGas', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .addParameters({ mockConfigBasic: DEFAULT_CONFIG })
  .add('view by region', () => (
    <OilAndGas
      vizDimension={{ height: 800, width: 900 }}
    />
  ))
  .addParameters({ mockConfigExtra: { view: 'source' } })
  .add('view by source', () => (
    <OilAndGas
      vizDimension={{ height: 800, width: 900 }}
    />
  ));
