import React from 'react';

import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import { Share } from './index';
import ReadMe from './README.md';

const DEFAULT_CONFIG = {
  page: 'by-region',
  mainSelection: 'energyDemand',
  yearId: '2020',
  scenarios: ['Evolving'],
  view: 'region',
  unit: 'petajoules',
  provinces: ['AB'],
  provinceOrder: ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'],
};

storiesForComponent('Components|Share', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .addParameters({ mockConfigBasic: DEFAULT_CONFIG })
  .add('default', () => <Share keepMounted={false} />);
