import React from 'react';

import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import Electricity from './index';
import ReadMe from './README.md';

export const DEFAULT_CONFIG = {
  page: 'electricity',
  yearId: '2020',
  view: 'region',
  unit: 'petajoules',
  provinces: ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'],
  sources: ['BIO', 'COAL', 'GAS', 'HYDRO', 'NUCLEAR', 'OIL', 'RENEWABLE'],
};

export const MOCK_DATA_REGION = Array(46).fill(undefined).map((_, i) => i).reduce((data, year) => ({
  ...data,
  [2005 + year]: {
    AB: [
      { name: 'COAL', value: 43581.072 },
      { name: 'GAS', value: 19568.76 },
      { name: 'HYDRO', value: 2316 },
      { name: 'BIO', value: 1725.168 },
      { name: 'RENEWABLE', value: 741 },
      { name: 'OIL', value: 509.4367 },
    ].map(type => ({ ...type, value: type.value * (1 + Math.random() / 5) })),
    NB: [
      { name: 'HYDRO', value: 36440 },
      { name: 'COAL', value: 413.2573 },
      { name: 'RENEWABLE', value: 53 },
      { name: 'GAS', value: 41.6505 },
      { name: 'BIO', value: 27.33 },
      { name: 'OIL', value: 8.2922 },
    ].map(type => ({ ...type, value: type.value * (1 + Math.random() / 5) })),
  },
}), {});

export const MOCK_DATA_SOURCE = Array(46).fill(undefined).map((_, i) => i).reduce((data, year) => ({
  ...data,
  [2005 + year]: {
    HYDRO: [
      { name: 'QC', value: 173112.6 },
      { name: 'BC', value: 60327 },
      { name: 'NL', value: 40741.37 },
      { name: 'MB', value: 36440 },
      { name: 'ON', value: 35480 },
      { name: 'SK', value: 4573 },
      { name: 'NB', value: 3875 },
      { name: 'AB', value: 2316 },
      { name: 'NS', value: 926.0648 },
      { name: 'YT', value: 330.633 },
      { name: 'NT', value: 259.107 },
    ],
    NUCLEAR: [
      { name: 'ON', value: 77969 },
      { name: 'NB', value: 4378 },
      { name: 'QC', value: 4321.577 },
    ],
    COAL: [
      { name: 'AB', value: 43581.072 },
      { name: 'ON', value: 28734.08 },
      { name: 'SK', value: 13157.72 },
      { name: 'NS', value: 8374.984 },
      { name: 'NB', value: 3101.052 },
      { name: 'MB', value: 413.2573 },
    ],
  },
}), {});

export const MOCK_DATA_SINGLE = Array(46).fill(undefined).map((_, i) => i).reduce((data, year) => ({
  ...data,
  [2005 + year]: {
    AB: [
      { name: 'COAL', value: 43581.072 },
      { name: 'GAS', value: 19568.76 },
      { name: 'HYDRO', value: 2316 },
      { name: 'BIO', value: 1725.168 },
      { name: 'RENEWABLE', value: 741 },
      { name: 'OIL', value: 509.4367 },
    ].map(type => ({ ...type, value: type.value * (1 + Math.random()) })),
  },
}), {});

export const MOCK_YEAR = { min: 2005, max: 2050, forecastStart: 2020 };

const getComponent = data => (
  <div style={{ height: 500, width: '100%' }}>
    <Electricity data={data} year={MOCK_YEAR} />
  </div>
);

storiesForComponent('Pages|Electricity', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .addParameters({ mockConfigBasic: DEFAULT_CONFIG })
  .add('multiple bubbles', () => getComponent(MOCK_DATA_REGION))
  .add('single bubble', () => getComponent(MOCK_DATA_SINGLE));
