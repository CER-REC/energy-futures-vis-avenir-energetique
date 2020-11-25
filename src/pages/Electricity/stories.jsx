import React from 'react';

import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import Electricity from './index';
import ReadMe from './README.md';

storiesForComponent('Pages|Electricity', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .add('default', () => <Electricity />);
