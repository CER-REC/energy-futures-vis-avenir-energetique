import React from 'react';
import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import Hint from './index';
import ReadMe from './README.md';

storiesForComponent('Components|Hint', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .add('default', () => <Hint />);
