import React from 'react';

import { withKnobs, number, radios, select } from '@storybook/addon-knobs';
import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import OilAndGas from './index';
import ReadMe from './README.md';

storiesForComponent('Pages|TreeMap', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .addDecorator(withKnobs)
  .add('default', () => {
    const view = radios('view', {
      'By Source': 'bySource',
      'By Region': 'byRegion',
    }, 'bySource', 'Options');
    const iteration = number('Iteration', 6, {
      range: true,
      min: 1,
      max: 6,
      step: 1,
    }, 'Options');

    const selectedYear1 = number('Year 1', 2005, {
      range: true,
      min: 2005,
      max: 2040,
      step: 1,
    }, 'Options');
    const selectedYear2 = number('Year 2', 2005, {
      range: true,
      min: 2005,
      max: 2040,
      step: 1,
    }, 'Options');

    const region1 = select('Region 1', {
      All: ['AB', 'BC', 'SK'],
      Alberta: ['AB'],
      'British Columbia': ['BC'],
      Saskatchuwan: ['SK'],
    }, ['AB', 'BC', 'SK'], 'Regions');

    const region2 = select('Region 2', {
      All: ['AB', 'BC', 'SK'],
      Alberta: ['AB'],
      'British Columbia': ['BC'],
      Saskatchuwan: ['SK'],
    }, ['AB', 'BC', 'SK'], 'Regions');

    return (
      <OilAndGas
        view={view}
        selectedYear1={selectedYear1}
        selectedYear2={selectedYear2}
        regions1={region1}
        regions2={region2}
        iteration={iteration}
      />
    );
  });
