import React from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import YearSelect from '../YearSelect';
import ControlHorizontal from '../ControlHorizontal';
import LowerHorizontalControl from '../LowerHorizontalControl';
// import Control from '../Control';
import Region from '../Region';

const PageLayout = ({ children, showRegion = false /* boolean */ }) => {
  const classes = useStyles();

  return (
    <Grid container direction="column" spacing={4} className={classes.root}>
      <Grid item><YearSelect /></Grid>
      <Grid item><ControlHorizontal /></Grid>
      <Grid item>
        <Grid container wrap="nowrap" spacing={2}>
          {/* <Grid item><Control width={180} /></Grid> */}
          {showRegion && <Grid item><Region /></Grid>}
          <Grid container direction="column"> 
          <Grid item><LowerHorizontalControl /></Grid>
          {children && <Grid item className={classes.graph}>{children}</Grid>}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4, 0),
    backgroundColor: theme.palette.background.paper,
  },
  graph: {
    flexGrow: 1,
    height: 700,
  },
}));

export default PageLayout;
