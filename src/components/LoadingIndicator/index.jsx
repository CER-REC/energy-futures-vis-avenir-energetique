import React from 'react';
import {
  makeStyles, createStyles,
  Grid, Typography, CircularProgress,
} from '@material-ui/core';

const LoadingIndicator = ({ text, fullHeight }) => {
  const classes = useStyles({ text, fullHeight });

  return (
    <Grid container className={`${classes.container} LoadingIndicator`}>
      <Grid container direction="column" justify="space-around" alignItems="center">
        <CircularProgress color="primary" size={66} />
        {text && <Typography variant="h6" color="primary">{text}</Typography>}
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => createStyles({
  container: props => ({
    height: props.fullHeight ? '100vh' : 'auto',
    minHeight: 250,
    '& > div': { margin: 'auto' },
    '& h6': { marginTop: theme.spacing(2) }
  }),
}));

export default LoadingIndicator;
