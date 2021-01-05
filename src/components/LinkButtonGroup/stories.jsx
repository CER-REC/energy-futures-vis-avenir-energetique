import React from 'react';
import { withKnobs, radios } from '@storybook/addon-knobs';
import { storiesForComponent } from '../../../.storybook/utils';
import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import LinkButtonGroup from './index';
import ReadMe from './README.md';

storiesForComponent('Components|LinkButtonGroup', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .addDecorator(withKnobs)
  .add('default', () => (
    <LinkButtonGroup direction={radios('Direction', { Column: 'column', Row: 'row' }, 'column')} />
  ));
