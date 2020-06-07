import React from 'react';
import { storiesForComponent } from '../../../.storybook/utils';
import Prototype from './index';
import ReadMe from './README.md';

storiesForComponent('Components|Prototype', module, ReadMe)
  .add('default', () => <Prototype />);
