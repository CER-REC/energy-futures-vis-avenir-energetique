import React from 'react';

import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';
import { storiesForComponent } from '../../../.storybook/utils';
import { Share } from './index';
import ReadMe from './README.md';

storiesForComponent('Components|Share', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .add('default', () => <Share />);
