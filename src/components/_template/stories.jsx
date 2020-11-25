/*
import React from 'react';
import withInteraction, { getInteractionProps } from 'storybook-addon-interaction';
import { storiesForComponent } from '../../../.storybook/utils';
import withStatus from '../../../.storybook/addon-status';
import MyComponentName from './';
import ReadMe from './README.md';

storiesForComponent('Components|MyComponentName', module, ReadMe)
  .addDecorator(withStatus('functionalityUnderDevelopment'))
  .addDecorator(withInteraction({ actions: ['onChange', 'someInteractionPropFunc'] }))
  .add('default', () => (
    <MyComponentName {...getInteractionProps()} />
  ), {
    state: { selected: 3, otherPropExample: false },
    actions: {
      onChange: () => v => ({ selected: v }),
      someInteractionPropFunc: state => () => ({ otherPropExample: !state.otherPropExample}),
    },
  })
  .add('otherPropExample', (
    <MyComponentName
      someInteractionPropFunc={false}
      {...getInteractionProps()}
    />
  ));
*/
