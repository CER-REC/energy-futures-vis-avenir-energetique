import React from 'react';
import { storiesForComponent } from '../../../.storybook/utils';
import Scenarios from './index';
import ReadMe from './README.md';
import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';

storiesForComponent('Pages|Scenarios', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .add('default', () => <Scenarios />);
