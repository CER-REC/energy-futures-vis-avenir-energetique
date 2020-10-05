import React from 'react';
// import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { ResponsiveTreeMap } from '@nivo/treemap';

const provs = [
  { name: 'AB', total: 200 },
  { name: 'BC', total: 190 },
  { name: 'MB', total: 180 },
  { name: 'NB', total: 170 },
  { name: 'NL', total: 160 },
  { name: 'NS', total: 150 },
  { name: 'NT', total: 140 },
  { name: 'NU', total: 130 },
  { name: 'ON', total: 120 },
  { name: 'PE', total: 110 },
  { name: 'QC', total: 100 },
  { name: 'SK', total: 90 },
  { name: 'YT', total: 80 }];

const root = {
  name: 'nivo',
  color: 'hsl(274, 70%, 50%)',
  children: [
    {
      name: 'Alberta',
      color: 'hsl(266, 70%, 50%)',
      children: [
        {
          name: 'Alberta',
          color: 'hsl(316, 70%, 50%)',
          children: [
            {
              name: 'CL',
              color: 'hsl(81, 70%, 50%)',
              loc: 130550,
            },
            {
              name: 'CH',
              color: 'hsl(320, 70%, 50%)',
              loc: 146938,
            },
            {
              name: 'C5+',
              color: 'hsl(24, 70%, 50%)',
              loc: 139599,
            },
            {
              name: 'FC',
              color: 'hsl(356, 70%, 50%)',
              loc: 137290,
            },
            {
              name: 'MB',
              color: 'hsl(220, 70%, 50%)',
              loc: 137290,
            }, {
              name: 'iSB',
              color: 'hsl(130, 70%, 50%)',
              loc: 137290,
            },
          ],
        },

      ],
    },
  ],
};

const trees = provs.map(prov => (
  <div key={prov.name} style={{ height: prov.total, width: prov.total, marginRight: '20px' }}>
    <ResponsiveTreeMap
      root={root}
      identity="name"
      value="loc"
      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      label={d => d.name}
      labelSkipSize={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.2]] }}
      colors={d => d.color}
      borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
      animate
      motionStiffness={90}
      motionDamping={11}
    />
  </div>
));

const TreeMap = () => (
  <Grid container wrap="nowrap">
    {trees}
  </Grid>
);

export default TreeMap;
