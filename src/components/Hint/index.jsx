import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, createStyles, Grid, Tooltip } from '@material-ui/core';
import HintIcon from '@material-ui/icons/HelpOutline';

const useStyles = makeStyles(theme => createStyles({
  root: { width: 'auto' },
  tooltip: { margin: theme.spacing(-0.5, 0.5, 0) },
  icon: {
    fontSize: '1rem',
    color: theme.palette.secondary.light,
  },
}));

const Hint = ({ children, message }) => {
  const classes = useStyles();

  return (
    <Grid container wrap="nowrap" className={classes.root}>
      {children}
      <Tooltip title={message} placement="top" className={classes.tooltip}>
        <HintIcon className={classes.icon} />
      </Tooltip>
    </Grid>
  );
};

Hint.propTypes = {
  children: PropTypes.node,
  message: PropTypes.string,
};

Hint.defaultProps = {
  children: null,
  message: 'This is a placeholder for the real hint message.',
};

export default Hint;
