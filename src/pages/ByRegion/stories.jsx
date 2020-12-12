import React from 'react';

import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import ByRegion from './index';
import ReadMe from './README.md';

export const DEFAULT_CONFIG = {
  page: 'by-region',
  yearId: '2020',
  unit: 'petajoules',
  provinceOrder: ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'],
};

export const BASE_DATA = {
  AB: 2818.1722,
  BC: 1259.11,
  MB: 288.9049,
  NB: 253.0975,
  NL: 161.7068,
  NS: 229.9022,
  NT: 18.7046,
  NU: 3.6129,
  ON: 3045.0494,
  PE: 26.5185,
  QC: 1848.2299,
  SK: 534.421,
  YT: 8.1578,
};

/**
 * Add some randomness in the mock data to generate
 * fluctuation in the graph so that it is not monotone.
 */
const MOCK_DATA = Array(46).fill(undefined).map((_, i) => ({
  year: `${2005 + i}`, ...Object.keys(BASE_DATA).reduce((accu, curr) => ({ ...accu, [curr]: BASE_DATA[curr] * (1 + Math.random() / 4) }), {}),
}));

storiesForComponent('Pages|ByRegion', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .addParameters({ mockConfigBasic: DEFAULT_CONFIG })
  .add('default', () => <ByRegion data={MOCK_DATA} year={{ min: 2005, max: 2050, forecastStart: 2020 }} />);
