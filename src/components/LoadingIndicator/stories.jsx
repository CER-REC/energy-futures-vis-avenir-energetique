import React from 'react';
import { withKnobs, boolean, radios } from '@storybook/addon-knobs';
import { storiesForComponent } from '../../../.storybook/utils';
import LoadingIndicator from './index';
import ReadMe from './README.md';

storiesForComponent('Components|LoadingIndicator', module, ReadMe)
  .addDecorator(withKnobs)
  .add('default', () => (
    <LoadingIndicator
      type={radios('Type', ['api', 'app'], 'api')}
      fullHeight={boolean('Full Height', true)}
    />
  ));
