import React from 'react';
import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import BySector from './index';
import ReadMe from './README.md';

export const DEFAULT_CONFIG = {
  page: 'by-sector',
  yearId: '2020',
  sector: 'TRANSPORTATION',
  unit: 'petajoules',
  sourceOrder: ['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL'],
};

export const BASE_DATA = {
  BIO: { value: 11.08, color: '#1C7F24' },
  ELECTRICITY: { value: 3.53, color: '#7ACBCB' },
  GAS: { value: 1.88, color: '#890038' },
  OIL: { value: 98.16, color: '#FF821E' },
  AVIATION: { value: 254.33, color: '#FF821E' },
  DIESEL: { value: 745.31, color: '#FF821E' },
  GASOLINE: { value: 1355.29, color: '#FF821E' },
};

export const GENERATE_DATA = (id, randomness /* boolean */) => Array(46)
  .fill(undefined)
  .map((_, i) => ({
    x: `${2005 + i}`,
    y: (BASE_DATA[id]?.value || 0) * (1 + (randomness ? (Math.random() / 5) : 0)),
  }));

/**
 * Add some randomness in the mock data to generate
 * fluctuation in the graph so that it is not monotone.
 */
const MOCK_DATA = [
  { id: 'BIO', data: GENERATE_DATA('BIO', true) },
  { id: 'ELECTRICITY', data: GENERATE_DATA('ELECTRICITY', true) },
  { id: 'GAS', data: GENERATE_DATA('GAS', true) },
  { id: 'OIL', data: GENERATE_DATA('OIL', true) },
];

storiesForComponent('Pages|BySector', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .addParameters({ mockConfigBasic: DEFAULT_CONFIG })
  .add('default', () => <BySector data={MOCK_DATA} year={{ min: 2005, max: 2050, forecastStart: 2020 }} />);
