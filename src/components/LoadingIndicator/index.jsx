import React from 'react';
import {
  makeStyles, createStyles,
  Grid, Typography, CircularProgress,
} from '@material-ui/core';
import propTypes from 'prop-types';

const useStyles = makeStyles(theme => createStyles({
  container: props => ({
    height: props.fullHeight ? '100vh' : 'auto',
    minHeight: 250,
    '& > div': { margin: 'auto' },
    '& h6': { marginTop: theme.spacing(2) },
  }),
}));

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

LoadingIndicator.propTypes = {
  text: propTypes.string,
  fullHeight: propTypes.bool,
};

LoadingIndicator.defaultProps = {
  text: '',
  fullHeight: false,
};

export default LoadingIndicator;
