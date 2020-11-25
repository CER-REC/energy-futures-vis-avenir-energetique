import React from 'react';

import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import Landing from './index';
import ReadMe from './README.md';

storiesForComponent('Pages|Landing', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .add('default', () => <Landing />);
