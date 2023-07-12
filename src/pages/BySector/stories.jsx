import React from 'react';
import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import BySector from './index';
import ReadMe from './README.md';

let DEFAULT_CONFIG;
export default DEFAULT_CONFIG = {
  page: 'by-sector',
  yearId: '2023',
  sector: 'TRANSPORTATION',
  unit: 'petajoules',
  sourceOrder: ['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL'],
  scenarios: ['Global Net-zero'],
  sources: ['BIO'],
  provinces: ['ON'],
};

storiesForComponent('Pages|BySector', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .addParameters({ mockConfigBasic: DEFAULT_CONFIG })
  .addParameters({
    mockConfigExtra: {
      sources: ['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL'],
      provinces: ['ALL'],
    },
  })
  .add('default', () => <BySector />);
