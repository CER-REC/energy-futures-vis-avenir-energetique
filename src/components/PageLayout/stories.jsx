import React from 'react';

import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import PageLayout from './index';
import ReadMe from './README.md';

storiesForComponent('Components|PageLayout', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .add('default', () => <PageLayout />);
