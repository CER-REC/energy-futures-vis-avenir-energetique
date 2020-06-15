import React from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import { ResponsiveLine } from '@nivo/line';
import data from './data';

import Control from '../../components/Control';
import Region from '../../components/Region';


const ByScenario = () => {
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
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 50, bottom: 50, left: 80 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, max: 'auto', stacked: true, reverse: false }}
          colors={{ scheme: 'nivo' }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabel="y"
          pointLabelYOffset={-12}
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
          useMesh={true}
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

export default ByScenario;
