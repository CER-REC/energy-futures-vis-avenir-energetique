import React from 'react';

import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import ByRegion from './index';
import ReadMe from './README.md';

let DEFAULT_CONFIG;
export default DEFAULT_CONFIG = {
  page: 'by-region',
  mainSelection: 'energyDemand',
  yearId: '2023',
  unit: 'petajoules',
  provinceOrder: ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'],
  scenarios: ['Global Net-zero'],
  provinces: ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'],
};

storiesForComponent('Pages|ByRegion', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .addParameters({ mockConfigBasic: DEFAULT_CONFIG })
  .add('default', () => <ByRegion />);
