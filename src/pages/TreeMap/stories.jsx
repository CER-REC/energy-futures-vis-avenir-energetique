import React from 'react';

import { withKnobs, number, radios } from '@storybook/addon-knobs';
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
    // const iteration = number('Iteration', 6, {
    //   range: true,
    //   min: 1,
    //   max: 6,
    //   step: 1,
    // }, 'Options');

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

    const region1 = radios('Region 1', {
      Alberta: 'AB',
      'British Columbia': 'BC',
      Saskatchuwan: 'SK',
    }, 'AB', 'Options');
    const region2 = radios('Region 2', {
      Alberta: 'AB',
      'British Columbia': 'BC',
      Saskatchuwan: 'SK',
    }, 'BC', 'Options');

    return (
      <OilAndGas
        view={view}
        selectedYear1={selectedYear1}
        selectedYear2={selectedYear2}
        region1={region1}
        region2={region2}
        // iteration={iteration}
      />
    );
  });
