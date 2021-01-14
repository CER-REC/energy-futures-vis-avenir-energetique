import React from 'react';
import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import OilAndGas from './index';
import ReadMe from './README.md';

export const DEFAULT_CONFIG = {
  page: 'oil-and-gas',
  yearId: '2020',
  mainSelection: 'oilProduction',
  scenarios: ['Evolving'],
  unit: 'kilobarrels',
  view: 'region',
  provinces: ['ALL'],
  sources: ['C5', 'CONDENSATE', 'HEAVY', 'ISB', 'LIGHT', 'MB'],
  baseYear: 2005,
  compareYear: 2006,
};

export const MOCK_DATA_REGION = Array(46).fill(undefined).map((_, i) => i).reduce((data, year) => ({
  ...data,
  [2005 + year]: [
    {
      name: 'AB',
      total: 1775.0523424693474,
      children: [
        { name: 'MB', value: 626.46408 },
        { name: 'ISB', value: 438.39905999999996 },
        { name: 'LIGHT', value: 387.5075697903656 },
        { name: 'HEAVY', value: 183.6218663643784 },
        { name: 'C5', value: 98.91053068421976 },
        { name: 'CONDENSATE', value: 40.14923563038366 },
      ],
    },
    {
      name: 'SK',
      total: 419.58930505821843,
      children: [
        { name: 'HEAVY', value: 418.4023886611925 },
        { name: 'LIGHT', value: 0.60691737169272 },
        { name: 'C5', value: 0.5799990253332 },
      ],
    },
    { name: 'NL', total: 304.866606, children: [{ name: 'LIGHT', value: 304.866606 }] },
    {
      name: 'BC',
      total: year % 2 ? 41.646612236203914 : 0,
      children: year % 2 ? [
        { name: 'LIGHT', value: 29.216633124950697 },
        { name: 'C5', value: 7.592780817207959 },
        { name: 'CONDENSATE', value: 4.837198294045259 },
      ] : [],
    },
    { name: 'NT', total: 18.806502000000002, children: [{ name: 'LIGHT', value: 18.806502000000002 }] },
    { name: 'MB', total: 13.85948082225036, children: [{ name: 'LIGHT', value: 13.85948082225036 }] },
    { name: 'NS', total: year % 2 ? 12.9199782884568 : 0, children: year % 2 ? [{ name: 'C5', value: 12.9199782884568 }] : [] },
    { name: 'ON', total: year % 2 ? 2.3901239999999997 : 0, children: year % 2 ? [{ name: 'LIGHT', value: 2.3901239999999997 }] : [] },
    { name: 'PE', total: 0, children: [] },
    { name: 'NB', total: 0, children: [] },
    { name: 'QC', total: 0, children: [] },
    { name: 'YT', total: 0, children: [] },
    { name: 'NU', total: 0, children: [] },
  ],
}), {});

export const MOCK_DATA_SOURCE = Array(46).fill(undefined).map((_, i) => i).reduce((data, year) => ({
  ...data,
  [2005 + year]: [
    {
      name: 'LIGHT',
      total: 757.2538331092594,
      children: [
        { name: 'AB', value: 387.5075697903656 },
        { name: 'NL', value: 304.866606 },
        { name: 'BC', value: 29.216633124950697 },
        { name: 'NT', value: 18.806502000000002 },
        { name: 'MB', value: 13.85948082225036 },
        { name: 'ON', value: 2.3901239999999997 },
        { name: 'SK', value: 0.60691737169272 },
      ],
    },
    { name: 'MB', total: 626.46408, children: [{ name: 'AB', value: 626.46408 }] },
    {
      name: 'HEAVY',
      total: 602.0242550255709,
      children: [
        { name: 'SK', value: 418.4023886611925 },
        { name: 'AB', value: 183.6218663643784 },
      ],
    },
    { name: 'ISB', total: 438.39905999999996, children: [{ name: 'AB', value: 438.39905999999996 }] },
    {
      name: 'C5',
      total: 120.00328881521773,
      children: [
        { name: 'AB', value: 98.91053068421976 },
        { name: 'NS', value: 12.9199782884568 },
        { name: 'BC', value: 7.592780817207959 },
        { name: 'SK', value: 0.5799990253332 },
      ],
    },
    {
      name: 'CONDENSATE',
      total: 44.986433924428916,
      children: [
        { name: 'AB', value: 40.14923563038366 },
        { name: 'BC', value: 4.837198294045259 },
      ],
    },
  ],
}), {});

storiesForComponent('Pages|OilAndGas', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .addParameters({ mockConfigBasic: DEFAULT_CONFIG })
  .add('view by region', () => (
    <OilAndGas
      data={MOCK_DATA_REGION}
      year={{ min: 2005, max: 2050, forecastStart: 2020 }}
      vizDimension={{ height: 800, width: 900 }}
    />
  ))
  .addParameters({ mockConfigExtra: { view: 'source' } })
  .add('view by source', () => (
    <OilAndGas
      data={MOCK_DATA_SOURCE}
      year={{ min: 2005, max: 2050, forecastStart: 2020 }}
      vizDimension={{ height: 800, width: 900 }}
    />
  ));
