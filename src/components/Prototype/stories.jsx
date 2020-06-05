import React from 'react';
import { withKnobs, text, boolean } from "@storybook/addon-knobs";
import { storiesForComponent } from '../../../.storybook/utils';
import LoadingGuide from './index';
import ReadMe from './README.md';

storiesForComponent('Components|LoadingIndicator', module, ReadMe)
  // .addDecorator(withStatus('functionalityUnderDevelopment'))
  .addDecorator(withKnobs)
  .add('default', () => (
    <LoadingGuide
      text={text('Label', 'Loading')}
      fullHeight={boolean('Full Height', true)}
    />
  ));
