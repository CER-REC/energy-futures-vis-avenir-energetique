import React from 'react';
import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import ScenarioSelect from './index';
import ReadMe from './README.md';

storiesForComponent('Components|ScenarioSelect', module, ReadMe)
  .addParameters({
    mockConfigBasic: {
      page: 'by-region',
      mainSelection: 'energyDemand',
      yearId: '2020',
      scenarios: ['Reference'],
      view: 'region',
    },
  })
  .addDecorator(withConfigAndGQL)
  .add('2020', () => <ScenarioSelect />)
  .addParameters({ mockConfigExtra: { yearId: '2019' } })
  .add('2019', () => <ScenarioSelect />)
  .addParameters({ mockConfigExtra: { yearId: '2018' } })
  .add('2018', () => <ScenarioSelect />)
  .addParameters({ mockConfigExtra: { yearId: '2017' } })
  .add('2017', () => <ScenarioSelect />)
  .addParameters({ mockConfigExtra: { yearId: '2016*' } })
  .add('2016 Adjusted', () => <ScenarioSelect />)
  .addParameters({ mockConfigExtra: { yearId: '2016' } })
  .add('2016', () => <ScenarioSelect />);
