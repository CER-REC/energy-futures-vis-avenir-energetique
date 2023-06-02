import React from 'react';
import { makeStyles, Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(-2),
    '& svg': {
      height: theme.spacing(3.5),
      width: theme.spacing(3.5),
      padding: theme.spacing(0.5),
      color: theme.palette.common.white,
      borderRadius: '50%',
      verticalAlign: 'middle',
    },
    '& h6': { color: theme.palette.secondary.light },
  },
}));

const Header = ({ IconComponent, title }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} className={classes.root}>
      <Grid container alignItems="center" spacing={1}>
        <Grid item><IconComponent /></Grid>
        <Grid item>
          <Typography variant="h6">{title}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

Header.propTypes = {
  IconComponent: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;
