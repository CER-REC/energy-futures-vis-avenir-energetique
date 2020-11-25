import React from 'react';

import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import BySector from './index';
import ReadMe from './README.md';

storiesForComponent('Pages|BySector', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .add('default', () => <BySector />);
