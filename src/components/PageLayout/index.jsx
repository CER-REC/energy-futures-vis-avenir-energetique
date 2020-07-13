import React from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import ControlHorizontal from '../ControlHorizontal';
import Control from '../Control';
import Region from '../Region';


const PageLayout = ({ children, showRegion = false /* boolean */ }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={4} className={classes.root}>
      <Grid item xs={12}><ControlHorizontal /></Grid>
      <Grid item><Control width={180} /></Grid>
      {showRegion && <Grid item><Region /></Grid>}
      {children && <Grid item className={classes.graph}>{children}</Grid>}
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

export default PageLayout;
