import React from 'react';
import { storiesForComponent } from '../../../.storybook/utils';
import Scenarios from './index';
import ReadMe from './README.md';
import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';

let DEFAULT_CONFIG;
export default DEFAULT_CONFIG = {
  mainSelection: 'energyDemand',
  page: 'by-region',
  yearId: '2020',
  scenarios: ['Evolving'],
  unit: 'petajoules',
  provinces: ['ON'],
};

storiesForComponent('Pages|Scenarios', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .addParameters({ mockConfigBasic: DEFAULT_CONFIG })
  .add('default', () => <Scenarios />);
