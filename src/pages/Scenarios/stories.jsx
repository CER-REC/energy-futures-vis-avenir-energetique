import React from 'react';
import { storiesForComponent } from '../../../.storybook/utils';
import Scenarios from './index';
import ReadMe from './README.md';
import withConfigAndGQL from '../../../.storybook/addon-config-and-gql';

export const DEFAULT_CONFIG = {
  page: 'by-region',
  yearId: '2020',
  scenarios: ['Evolving'],
  unit: 'petajoules',
};

export const MOCK_DATA = [{
  id: 'Evolving',
  data: [
    { x: 2005, y: 10495.5881 },
    { x: 2006, y: 10483.1437 },
    { x: 2007, y: 10821.7113 },
    { x: 2008, y: 10612.4623 },
    { x: 2009, y: 10267.3791 },
    { x: 2010, y: 10548.0963 },
    { x: 2011, y: 10925.7427 },
    { x: 2012, y: 11084.4039 },
    { x: 2013, y: 11294.0164 },
    { x: 2014, y: 11366.9613 },
    { x: 2015, y: 11393.3692 },
    { x: 2016, y: 11267.4028 },
    { x: 2017, y: 11514.5233 },
    { x: 2018, y: 12152.4675 },
    { x: 2019, y: 12170.3384 },
    { x: 2020, y: 11364.7302 },
    { x: 2021, y: 11889.6772 },
    { x: 2022, y: 12014.4135 },
    { x: 2023, y: 11982.6789 },
    { x: 2024, y: 11939.0327 },
    { x: 2025, y: 11883.6812 },
    { x: 2026, y: 11855.761 },
    { x: 2027, y: 11802.3794 },
    { x: 2028, y: 11730.5698 },
    { x: 2029, y: 11639.0599 },
    { x: 2030, y: 11560.9228 },
    { x: 2031, y: 11513.7469 },
    { x: 2032, y: 11456.9712 },
    { x: 2033, y: 11367.4261 },
    { x: 2034, y: 11284.8618 },
    { x: 2035, y: 11211.9434 },
    { x: 2036, y: 11115.7014 },
    { x: 2037, y: 11015.1869 },
    { x: 2038, y: 10946.4178 },
    { x: 2039, y: 10897.1192 },
    { x: 2040, y: 10818.9825 },
    { x: 2041, y: 10730.0075 },
    { x: 2042, y: 10638.1076 },
    { x: 2043, y: 10551.2738 },
    { x: 2044, y: 10470.8445 },
    { x: 2045, y: 10383.5118 },
    { x: 2046, y: 10295.1017 },
    { x: 2047, y: 10209.1911 },
    { x: 2048, y: 10124.3517 },
    { x: 2049, y: 10043.8959 },
    { x: 2050, y: 9964.7608 },
  ],
}];

storiesForComponent('Pages|Scenarios', module, ReadMe)
  .addDecorator(withConfigAndGQL)
  .addParameters({ mockConfigBasic: DEFAULT_CONFIG })
  .add('default', () => <Scenarios data={MOCK_DATA} year={{ min: 2005, max: 2050, forecastStart: 2020 }} />);
