import React from 'react';
import { withKnobs, radios } from "@storybook/addon-knobs";
import { storiesForComponent } from '../../../.storybook/utils';
import Nav from './index';
import ReadMe from './README.md';

const TAB_OPTIONS = {
  'By Region': 'by-region',
  'By Sector': 'by-sector',
  'Electricity': 'electricity',
  'Scenarios': 'scenarios',
  'Demand': 'demand',
};

storiesForComponent('Components|Nav', module, ReadMe)
  .addDecorator(withKnobs)
  .add('default', () => <Nav page={radios('Tab', TAB_OPTIONS, 'by-region', '')} />);
