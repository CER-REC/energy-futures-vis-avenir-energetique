import React, { useState, useEffect } from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import { ResponsiveLine } from '@nivo/line';
import rawData from './data';

import Control from '../../components/Control';
import Region from '../../components/Region';


const SOURCES = ['electricity', 'oilProducts', 'bio', 'naturalGas', 'coal', 'solarWindGeothermal'];

const BySector = () => {
  const classes = useStyles();

  const [data, setData] = useState(undefined); // year : object

  useEffect(() => {
    const processedData = {};
    (rawData || []).map(seg => {
      if (!seg.year || !seg.source || !seg.value) {
        return;
      }
      !processedData[seg.year] && (processedData[seg.year] = {});
      !processedData[seg.year][seg.source] && (processedData[seg.year][seg.source] = 0);
      processedData[seg.year][seg.source] += seg.value;
    });

    const readyData = SOURCES.map(source => ({
      id: source,
      data: Object.keys(processedData).map(year => ({ x: year, y: processedData[year][source] || 0 })),
    }));

    setData(readyData);
  }, []);

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
          keys={SOURCES}
          margin={{ top: 50, right: 50, bottom: 50, left: 80 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, max: 'auto', stacked: true, reverse: false }}
          colors={{ scheme: 'nivo' }}
          enablePoints={false}
          enableArea={true}
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

export default BySector;
