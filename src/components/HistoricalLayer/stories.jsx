import React from 'react';
import { Bar } from '@nivo/bar';
import { withKnobs, number, text } from '@storybook/addon-knobs';

import { storiesForComponent } from '../../../.storybook/utils';
import HistoricalLayer from '.';
import ReadMe from './README.md';

const data = [{
  year: '2000',
  value: 100,
}, {
  year: '2001',
  value: 25,
}, {
  year: '2002',
  value: 15,
}, {
  year: '2003',
  value: 65,
}, {
  year: '2004',
  value: 89,
}, {
  year: '2005',
  value: 11,
}];

storiesForComponent('Components|HistoricalLayer', module, ReadMe)
  .addDecorator(withKnobs)
  .addParameters({ info: { propTables: [HistoricalLayer] } })
  .add('Default', () => (
    <Bar
      height={200}
      width={500}
      margin={{ bottom: 50 }}
      layers={['grid', 'axes', 'bars', 'markers', HistoricalLayer]}
      data={data}
      indexBy="year"
      forecastStart={number('Forecast Start', 2002, { min: 2000, max: 2005 })}
      historicalLabel={text('Historical Label', 'start')}
    />
  ));
