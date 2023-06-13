import React from 'react';
import { withKnobs, number } from '@storybook/addon-knobs';
import { getInteractionProps } from 'storybook-addon-interaction';
import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';

import { storiesForComponent } from '../../../.storybook/utils';
import YearSlider from './index';
import ReadMe from './README.md';

storiesForComponent('Components|YearSlider', module, ReadMe)
  .addDecorator(withKnobs)
  .addDecorator(withConfigAndGQL)
  .add('default', () => (
    <YearSlider
      {...getInteractionProps()}
      min={number('Start', 2000)}
      max={number('End', 2050)}
      forecast={number('Forecast Year', 2020)}
    />
  ));
