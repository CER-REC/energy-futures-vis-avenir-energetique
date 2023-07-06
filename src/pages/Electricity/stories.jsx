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
  provinces: ['ON', 'NB',],
  provinceOrder: ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'],
  sources: ['COAL', 'HYDRO', 'NUCLEAR'],
  sourceOrder: ['COAL', 'HYDRO', 'NUCLEAR'],
  scenarios: ['Global Net-zero'],
};

export const MOCK_DATA_REGION = Array(46).fill(undefined).map((_, i) => i).reduce((data, year) => ({
  ...data,
  [2005 + year]: {
    ON: [
      { name: 'COAL', value: 28734.08 },
      { name: 'HYDRO', value: 2316 },
      { name: 'NUCLEAR', value: 35480 },
    ].map(type => ({ ...type, value: type.value * (1 + Math.random() / 5) })),
    NB: [
      { name: 'HYDRO', value: 3875 },
      { name: 'COAL', value: 43581.072 },
      { name: 'NUCLEAR', value: 13157.72 },
    ].map(type => ({ ...type, value: type.value * (1 + Math.random() / 5) })),
  },
}), {});

export const MOCK_DATA_SOURCE = Array(46).fill(undefined).map((_, i) => i).reduce((data, year) => ({
  ...data,
  [2005 + year]: {
    HYDRO: [
      { name: 'ON', value: 2316 },
      { name: 'NB', value: 3875 },
    ],
    NUCLEAR: [
      { name: 'ON', value: 35480 },
      { name: 'NB', value: 13157.72 },
    ],
    COAL: [
      { name: 'ON', value: 28734.08 },
      { name: 'NB', value: 43581.072 },
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
      { name: 'OIL', value: 509.4367 },
      { name: 'SOLAR', value: 600 },
      { name: 'WIND', value: 141 },
    ].map(type => ({ ...type, value: type.value * (1 + Math.random()) })),
  },
}), {});

const getComponent = (
  <div style={{ height: 500, width: '100%' }}>
    <Electricity />
  </div>
);

storiesForComponent('Pages|Electricity', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .addParameters({ mockConfigBasic: DEFAULT_CONFIG })
  .add('multiple bubbles', () => getComponent(MOCK_DATA_REGION))
  .add('single bubble', () => getComponent(MOCK_DATA_SINGLE));
