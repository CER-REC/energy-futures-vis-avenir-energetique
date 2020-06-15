import React from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import { ResponsiveBar } from '@nivo/bar';
import data from './data';

import Control from '../../components/Control';
import Region from '../../components/Region';


const PROVINCES = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];

const ByRegion = () => {
  const classes = useStyles();

  if (!data) {
    return null;
  }

  return (
    <Grid container wrap="nowrap" spacing={2} className={classes.root}>
      <Grid item>
        <Control width={180} />
      </Grid>
      <Grid item>
        <Region />
      </Grid>
      <Grid item className={classes.graph}>
        <ResponsiveBar
          data={data}
          keys={PROVINCES}
          indexBy="year"
          margin={{ top: 50, right: 0, bottom: 50, left: 80 }}
          padding={0.1}
          colors={{ scheme: 'nivo' }}
          borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'middle',
            legendOffset: 32,
            format: year => (year % 5) ? '' : year,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          enableLabel={false}
          // labelSkipWidth={12}
          // labelSkipHeight={12}
          // labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
  graph: {
    flexGrow: 1,
    height: 700,
  },
}));

export default ByRegion;
