import React from 'react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { storiesForComponent } from '../../../.storybook/utils';
import LoadingIndicator from './index';
import ReadMe from './README.md';

storiesForComponent('Components|LoadingIndicator', module, ReadMe)
  .addDecorator(withKnobs)
  .add('default', () => (
    <LoadingIndicator
      text={text('Label', 'Loading')}
      fullHeight={boolean('Full Height', true)}
    />
  ));
