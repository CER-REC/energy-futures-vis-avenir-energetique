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
  .add('default', () => <ScenarioSelect multiSelect={false} isMinimized={false} setIsMinimized={() => {}} />);
