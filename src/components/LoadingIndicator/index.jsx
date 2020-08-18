import React, { useMemo } from 'react';
import {
  makeStyles, createStyles,
  Grid, Typography, CircularProgress,
} from '@material-ui/core';
import propTypes from 'prop-types';
import { useIntl } from 'react-intl';

const useStyles = makeStyles(theme => createStyles({
  container: props => ({
    height: props.fullHeight ? '100vh' : 'auto',
    minHeight: 250,
    '& > div': { margin: 'auto' },
    '& h6': { marginTop: theme.spacing(2) },
  }),
}));

const LoadingIndicator = ({ type, fullHeight }) => {
  const classes = useStyles({ fullHeight });
  const intl = useIntl();
  const message = useMemo(
    () => intl.formatMessage({ id: `components.loadingIndicator.${type}` }),
    [intl, type],
  );

  return (
    <Grid container className={`${classes.container} LoadingIndicator`}>
      <Grid container direction="column" justify="space-around" alignItems="center">
        <CircularProgress color="primary" size={66} />
        <Typography variant="h6" color="primary">{message}</Typography>
      </Grid>
    </Grid>
  );
};

LoadingIndicator.propTypes = {
  fullHeight: propTypes.bool,
  type: propTypes.oneOf(['api', 'app']).isRequired,
};

LoadingIndicator.defaultProps = {
  fullHeight: false,
};

export default LoadingIndicator;
