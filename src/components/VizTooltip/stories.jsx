import React from 'react';
import { storiesForComponent } from '../../../.storybook/utils';
import VizTooltip from './index';
import ReadMe from './README.md';

const MOCK_NODES = [
  { name: 'COAL', value: 43581.072, color: '#4B5E5B', translation: 'Coal & Coke' },
  { name: 'GAS', value: 19568.76, color: '#890038', translation: 'Natural Gas' },
  { name: 'HYDRO', value: 2316, color: '#5FBEE6', translation: 'Hydro / Wave / Tidal' },
  { name: 'BIO', value: 1725.168, color: '#1C7F24', translation: 'Biomass / Geothermal' },
  { name: 'RENEWABLE', value: 741, color: '#FFCC47', translation: 'Solar / Wind' },
  { name: 'OIL', value: 509.4367, color: '#FF821E', translation: 'Oil' },
];

storiesForComponent('Components|VizTooltip', module, ReadMe)
  .add('default', () => <VizTooltip nodes={MOCK_NODES} unit="kilobarrelEquivalents" />);
