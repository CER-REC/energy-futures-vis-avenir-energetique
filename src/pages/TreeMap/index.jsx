import React from 'react';
// import PropTypes from 'prop-types';
import { ResponsiveTreeMap } from '@nivo/treemap';

const root = {
  root: {
    name: 'nivo',
    color: 'hsl(274, 70%, 50%)',
    children: [
      {
        name: 'viz',
        color: 'hsl(266, 70%, 50%)',
        children: [
          {
            name: 'stack',
            color: 'hsl(316, 70%, 50%)',
            children: [
              {
                name: 'chart',
                color: 'hsl(81, 70%, 50%)',
                loc: 130550,
              },
              {
                name: 'xAxis',
                color: 'hsl(320, 70%, 50%)',
                loc: 146938,
              },
              {
                name: 'yAxis',
                color: 'hsl(24, 70%, 50%)',
                loc: 139599,
              },
              {
                name: 'layers',
                color: 'hsl(356, 70%, 50%)',
                loc: 137290,
              },
            ],
          },
          {
            name: 'pie',
            color: 'hsl(163, 70%, 50%)',
            children: [
              {
                name: 'chart',
                color: 'hsl(310, 70%, 50%)',
                children: [
                  {
                    name: 'pie',
                    color: 'hsl(240, 70%, 50%)',
                    children: [
                      {
                        name: 'outline',
                        color: 'hsl(206, 70%, 50%)',
                        loc: 104445,
                      },
                      {
                        name: 'slices',
                        color: 'hsl(31, 70%, 50%)',
                        loc: 161567,
                      },
                      {
                        name: 'bbox',
                        color: 'hsl(123, 70%, 50%)',
                        loc: 101212,
                      },
                    ],
                  },
                  {
                    name: 'donut',
                    color: 'hsl(222, 70%, 50%)',
                    loc: 15656,
                  },
                  {
                    name: 'gauge',
                    color: 'hsl(174, 70%, 50%)',
                    loc: 125596,
                  },
                ],
              },
              {
                name: 'legends',
                color: 'hsl(308, 70%, 50%)',
                loc: 135298,
              },
            ],
          },
        ],
      },
      {
        name: 'colors',
        color: 'hsl(123, 70%, 50%)',
        children: [
          {
            name: 'rgb',
            color: 'hsl(295, 70%, 50%)',
            loc: 69172,
          },
          {
            name: 'hsl',
            color: 'hsl(43, 70%, 50%)',
            loc: 34314,
          },
        ],
      },
      {
        name: 'utils',
        color: 'hsl(112, 70%, 50%)',
        children: [
          {
            name: 'randomize',
            color: 'hsl(76, 70%, 50%)',
            loc: 169918,
          },
          {
            name: 'resetClock',
            color: 'hsl(198, 70%, 50%)',
            loc: 198525,
          },
          {
            name: 'noop',
            color: 'hsl(168, 70%, 50%)',
            loc: 44530,
          },
          {
            name: 'tick',
            color: 'hsl(320, 70%, 50%)',
            loc: 132239,
          },
          {
            name: 'forceGC',
            color: 'hsl(184, 70%, 50%)',
            loc: 191482,
          },
          {
            name: 'stackTrace',
            color: 'hsl(314, 70%, 50%)',
            loc: 59013,
          },
          {
            name: 'dbg',
            color: 'hsl(9, 70%, 50%)',
            loc: 46250,
          },
        ],
      },
      {
        name: 'generators',
        color: 'hsl(269, 70%, 50%)',
        children: [
          {
            name: 'address',
            color: 'hsl(136, 70%, 50%)',
            loc: 129770,
          },
          {
            name: 'city',
            color: 'hsl(256, 70%, 50%)',
            loc: 86420,
          },
          {
            name: 'animal',
            color: 'hsl(29, 70%, 50%)',
            loc: 14779,
          },
          {
            name: 'movie',
            color: 'hsl(31, 70%, 50%)',
            loc: 48750,
          },
          {
            name: 'user',
            color: 'hsl(302, 70%, 50%)',
            loc: 67098,
          },
        ],
      },
      {
        name: 'set',
        color: 'hsl(314, 70%, 50%)',
        children: [
          {
            name: 'clone',
            color: 'hsl(183, 70%, 50%)',
            loc: 197689,
          },
          {
            name: 'intersect',
            color: 'hsl(44, 70%, 50%)',
            loc: 13609,
          },
          {
            name: 'merge',
            color: 'hsl(271, 70%, 50%)',
            loc: 64468,
          },
          {
            name: 'reverse',
            color: 'hsl(317, 70%, 50%)',
            loc: 70418,
          },
          {
            name: 'toArray',
            color: 'hsl(281, 70%, 50%)',
            loc: 4170,
          },
          {
            name: 'toObject',
            color: 'hsl(195, 70%, 50%)',
            loc: 11491,
          },
          {
            name: 'fromCSV',
            color: 'hsl(314, 70%, 50%)',
            loc: 86252,
          },
          {
            name: 'slice',
            color: 'hsl(279, 70%, 50%)',
            loc: 93884,
          },
          {
            name: 'append',
            color: 'hsl(318, 70%, 50%)',
            loc: 62344,
          },
          {
            name: 'prepend',
            color: 'hsl(43, 70%, 50%)',
            loc: 21324,
          },
          {
            name: 'shuffle',
            color: 'hsl(39, 70%, 50%)',
            loc: 114663,
          },
          {
            name: 'pick',
            color: 'hsl(318, 70%, 50%)',
            loc: 185420,
          },
          {
            name: 'plouc',
            color: 'hsl(288, 70%, 50%)',
            loc: 11881,
          },
        ],
      },
      {
        name: 'text',
        color: 'hsl(180, 70%, 50%)',
        children: [
          {
            name: 'trim',
            color: 'hsl(21, 70%, 50%)',
            loc: 15349,
          },
          {
            name: 'slugify',
            color: 'hsl(239, 70%, 50%)',
            loc: 10510,
          },
          {
            name: 'snakeCase',
            color: 'hsl(241, 70%, 50%)',
            loc: 157150,
          },
          {
            name: 'camelCase',
            color: 'hsl(75, 70%, 50%)',
            loc: 107955,
          },
          {
            name: 'repeat',
            color: 'hsl(120, 70%, 50%)',
            loc: 171885,
          },
          {
            name: 'padLeft',
            color: 'hsl(285, 70%, 50%)',
            loc: 187992,
          },
          {
            name: 'padRight',
            color: 'hsl(55, 70%, 50%)',
            loc: 189823,
          },
          {
            name: 'sanitize',
            color: 'hsl(224, 70%, 50%)',
            loc: 152338,
          },
          {
            name: 'ploucify',
            color: 'hsl(33, 70%, 50%)',
            loc: 105598,
          },
        ],
      },
      {
        name: 'misc',
        color: 'hsl(223, 70%, 50%)',
        children: [
          {
            name: 'greetings',
            color: 'hsl(171, 70%, 50%)',
            children: [
              {
                name: 'hey',
                color: 'hsl(204, 70%, 50%)',
                loc: 28436,
              },
              {
                name: 'HOWDY',
                color: 'hsl(73, 70%, 50%)',
                loc: 96684,
              },
              {
                name: 'aloha',
                color: 'hsl(163, 70%, 50%)',
                loc: 93890,
              },
              {
                name: 'AHOY',
                color: 'hsl(163, 70%, 50%)',
                loc: 142475,
              },
            ],
          },
          {
            name: 'other',
            color: 'hsl(206, 70%, 50%)',
            loc: 174240,
          },
          {
            name: 'path',
            color: 'hsl(145, 70%, 50%)',
            children: [
              {
                name: 'pathA',
                color: 'hsl(224, 70%, 50%)',
                loc: 66012,
              },
              {
                name: 'pathB',
                color: 'hsl(28, 70%, 50%)',
                children: [
                  {
                    name: 'pathB1',
                    color: 'hsl(26, 70%, 50%)',
                    loc: 35284,
                  },
                  {
                    name: 'pathB2',
                    color: 'hsl(136, 70%, 50%)',
                    loc: 140030,
                  },
                  {
                    name: 'pathB3',
                    color: 'hsl(182, 70%, 50%)',
                    loc: 136068,
                  },
                  {
                    name: 'pathB4',
                    color: 'hsl(355, 70%, 50%)',
                    loc: 68269,
                  },
                ],
              },
              {
                name: 'pathC',
                color: 'hsl(102, 70%, 50%)',
                children: [
                  {
                    name: 'pathC1',
                    color: 'hsl(339, 70%, 50%)',
                    loc: 133492,
                  },
                  {
                    name: 'pathC2',
                    color: 'hsl(49, 70%, 50%)',
                    loc: 140268,
                  },
                  {
                    name: 'pathC3',
                    color: 'hsl(160, 70%, 50%)',
                    loc: 49459,
                  },
                  {
                    name: 'pathC4',
                    color: 'hsl(236, 70%, 50%)',
                    loc: 54781,
                  },
                  {
                    name: 'pathC5',
                    color: 'hsl(196, 70%, 50%)',
                    loc: 126221,
                  },
                  {
                    name: 'pathC6',
                    color: 'hsl(85, 70%, 50%)',
                    loc: 181982,
                  },
                  {
                    name: 'pathC7',
                    color: 'hsl(241, 70%, 50%)',
                    loc: 29779,
                  },
                  {
                    name: 'pathC8',
                    color: 'hsl(351, 70%, 50%)',
                    loc: 93286,
                  },
                  {
                    name: 'pathC9',
                    color: 'hsl(293, 70%, 50%)',
                    loc: 67536,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

const TreeMap = () => (
  <div style={{ height: 800 }}>
    hello
    <ResponsiveTreeMap
      root={root}
      identity="name"
      value="name"
      tile="binary"
      innerPadding={3}
      outerPadding={3}
      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      label="name"
      labelSkipSize={27}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.2]] }}
      colors={{ scheme: 'nivo' }}
      borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
      animate
      motionStiffness={90}
      motionDamping={11}
    />
  </div>
);

// TreeMap.propTypes = {
//   data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
//   year: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number }),
// };

// TreeMap.defaultProps = {
//   data: undefined,
//   year: { min: 0, max: 0 },
// };

export default TreeMap;
