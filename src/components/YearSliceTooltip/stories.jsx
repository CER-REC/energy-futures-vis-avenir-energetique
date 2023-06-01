import React from 'react';
import { storiesForComponent } from '../../../.storybook/utils';
import ReadMe from './README.md';
import YearSliceTooltip from './index';

const MOCK_NODES = [
  {
    title: 'Global Net-zero',
    unit: 'kilobarrelEquivalents',
    nodes: [
      { value: 43581.072, color: '#4B5E5B', name: 'Coal & Coke' },
      { value: 19568.76, color: '#890038', name: 'Natural Gas' },
      { value: 2316, color: '#5FBEE6', name: 'Hydro / Wave / Tidal' },
      { value: 1725.168, color: '#1C7F24', name: 'Biomass / Geothermal' },
      { value: 741, color: '#FFCC47', name: 'Solar / Wind' },
      { value: 509.4367, color: '#FF821E', name: 'Oil' },
    ],
  },
];

storiesForComponent('Components|YearSliceTooltip', module, ReadMe)
  .add('default', () => <YearSliceTooltip sections={MOCK_NODES} year="2023" />);
