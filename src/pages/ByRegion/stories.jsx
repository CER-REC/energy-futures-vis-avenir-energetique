import React from 'react';

import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import ByRegion from './index';
import ReadMe from './README.md';

storiesForComponent('Pages|ByRegion', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .add('default', () => <ByRegion />);
