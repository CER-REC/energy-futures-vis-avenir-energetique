import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 44,
    paddingTop: 40,
    paddingBottom: 4,
    border: '1px solid #999',
    borderRadius: 24,
  },
  node: {
    height: 28,
    width: 28,
    margin: '2px auto',
    backgroundColor: theme.palette.common.white,
    backgroundSize: '150% 150%',
    border: `2px solid ${theme.palette.secondary.main}`,
    borderRadius: '50%',
    transition: 'box-shadow .25s ease-in-out',
    zIndex: 1,
    '&:hover': { boxShadow: theme.shadows[6] },
    '&.selected': { backgroundColor: '#FF821E' },

    '&.disabled': {
      borderColor: theme.palette.secondary.main,
      backgroundColor: theme.palette.common.white,
    },
    '&.disabled:before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      height: 2,
      width: '105%',
      transform: 'translate(-50%, -50%) rotate(-45deg)',
      backgroundColor: theme.palette.secondary.main,
      borderRadius: 1,
    },
    '&.disabled:hover': { boxShadow: theme.shadows[0] },
  },
}));

const PATTERNS = {
  AVIATION: 'dots',
  DIESEL: 'lines-horizontal',
  GASOLINE: 'lines-vertical',
  OIL: 'squares',
};

const OilSubgroup = ({ disabled /* AVIATION, DIESEL, GASOLINE, OIL */ }) => {
  const classes = useStyles();
  const [selected, setSelected] = useState(['AVIATION', 'DIESEL', 'GASOLINE', 'OIL']);

  const toggleSelection = (event, item) => {
    event.stopPropagation();
    setSelected(selected.includes(item)
      ? selected.filter(source => source !== item)
      : [...selected, item]);
  };

  return (
    <Grid container direction="column" spacing={0} className={classes.root}>
      {['AVIATION', 'DIESEL', 'GASOLINE', 'OIL'].map(source => (
        <Grid item key={`draggable-list-sub-group-${source}`}>
          <div
            role="button"
            tabIndex={0}
            onClick={event => toggleSelection(event, source)}
            onKeyPress={event => event.key === 'Enter' && toggleSelection(event, source)}
            className={[
              classes.node,
              selected.includes(source) && 'selected',
              disabled.includes(source) && 'disabled',
            ].filter(Boolean).join(' ')}
          >
            <svg height="100%" width="100%" viewBox="0 0 50 50">
              <circle fill={`url(#${PATTERNS[source]}${selected.includes(source) ? '' : '-no-bg'})`} cx="50%" cy="50%" r="50%" />
            </svg>
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

OilSubgroup.propTypes = {
  disabled: PropTypes.arrayOf(PropTypes.string),
};

OilSubgroup.defaultProps = {
  disabled: [],
};

export default OilSubgroup;
