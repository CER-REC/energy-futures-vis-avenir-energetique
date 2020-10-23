import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Grid } from '@material-ui/core';
import { OIL_SUBGROUP, SOURCE_PATTERNS } from '../../constants';

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
  },
}));

const OilSubgroup = ({ selected, disabled /* e.g. [AVIATION, GASOLINE, DIESEL, OIL] */ }) => {
  const classes = useStyles();
  const styling = useCallback(
    source => [classes.node, selected && 'selected', disabled.includes(source) && 'disabled'].filter(Boolean).join(' '),
    [classes, selected, disabled],
  );

  return (
    <>
      {/* Definitions of pattern masking to support both selected and unselected states. */}
      <svg>
        <defs>
          {OIL_SUBGROUP.map(source => (
            <mask key={`node-${source}-mask`} id={`node-${source}-mask`} x="0" y="0" height="100%" width="100%">
              <rect x="0" y="0" height="200%" width="200%" fill={`url(#${SOURCE_PATTERNS[source]}-mask)`} />
            </mask>
          ))}
        </defs>
      </svg>

      {/* The vertical arrangement of oil sub-group options. */}
      <Grid container direction="column" spacing={0} className={classes.root}>
        {OIL_SUBGROUP.map(source => (
          <Grid item key={`draggable-list-sub-group-${source}`}>
            <div className={styling(source)}>
              <svg height="100%" width="100%" viewBox="0 0 50 50">
                <circle cx="50%" cy="50%" r="50%" fill={selected ? '#FF821E' : '#BBB'} mask={`url(#node-${source}-mask)`} />
              </svg>
            </div>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

OilSubgroup.propTypes = {
  selected: PropTypes.bool,
  disabled: PropTypes.arrayOf(PropTypes.string),
};

OilSubgroup.defaultProps = {
  selected: true,
  disabled: [],
};

export default OilSubgroup;
