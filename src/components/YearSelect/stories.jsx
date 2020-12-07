import React from 'react';

import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import YearSelect from './index';
import ReadMe from './README.md';

storiesForComponent('Components|YearSelect', module, ReadMe)
  .addParameters({
    mockConfigBasic: {
      page: 'by-region',
      mainSelection: 'energyDemand',
      yearId: '2019',
      scenarios: ['Reference'],
      view: 'region',
    },
  })
  .addDecorator(withConfigAndGQL)
  .add('Default', () => <YearSelect />);
