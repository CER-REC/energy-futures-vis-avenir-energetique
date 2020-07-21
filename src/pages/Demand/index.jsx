// @ts-check
import React, { useEffect, useState } from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import Control from '../../components/Control';
import Region from '../../components/Region';
import Rose from './Rose';
import data from './data/data';

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

const SunBurstChart = () => {
  const classes = useStyles();
  const [allRoses, allRosesSet] = useState(null);

  const updateRoses = () => {
    allRosesSet(Object.keys(data).map(province => <Rose provinceData={data[province]} />));
  };

  useEffect(() => {
    if (!allRoses) {
      updateRoses();
    }
  });

  return (
    <Grid container wrap="nowrap" spacing={2} className={classes.root}>
      <Grid item>
        <Control width={180} />
      </Grid>
      <Grid item>
        <Region width='auto' />
      </Grid>
      <Grid item className={classes.graph}>
        {allRoses != null ? allRoses : null}
      </Grid>
    </Grid>
  );
};

export default SunBurstChart;
