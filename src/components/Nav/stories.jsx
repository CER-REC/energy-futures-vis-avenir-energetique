import React from 'react';
import { withKnobs, radios } from "@storybook/addon-knobs";
import { storiesForComponent } from '../../../.storybook/utils';
import Nav from './index';
import ReadMe from './README.md';

const TAB_OPTIONS = {
  'Total Demand': '0',
  'By Sector': '1',
  'Electricity': '2',
  'Senarios': '3',
  'Demand': '4',
};

storiesForComponent('Components|Nav', module, ReadMe)
  .addDecorator(withKnobs)
  .add('default', () => <Nav tab={parseInt(radios('Tab', TAB_OPTIONS, '0', ''))} />);
