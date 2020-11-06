import React from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles, Grid, Typography,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles(theme => ({
  root: props => ({
    position: 'absolute',
    height: 36,
    width: 36,
    backgroundColor: theme.palette.common.white,
    border: `2px solid ${props.color || theme.palette.secondary.main}`,
    borderRadius: props.round ? '50%' : 0,
    textTransform: 'uppercase',
    transition: 'box-shadow .25s ease-in-out',
    '& > p, & > svg:first-of-type': {
      margin: props.attachment ? 4 : 'auto',
      color: props.color || theme.palette.secondary.main,
    },
    '&.selected': { backgroundColor: props.color || theme.palette.secondary.main },
    '&.selected > p, &.selected > svg': { color: theme.palette.common.white },
    '&:hover': { boxShadow: theme.shadows[6] },

    '&.disabled': {
      borderColor: theme.palette.secondary.main,
      backgroundColor: theme.palette.common.white,
    },
    '&.disabled > p, &.disabled > svg': {
      color: theme.palette.secondary.main,
      backgroundColor: props.round ? 'transparent' : theme.palette.common.white,
      fontWeight: 700,
      lineHeight: 1,
      zIndex: 1,
    },
    '&.disabled:before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      height: 2,
      width: props.round ? '105%' : '152%',
      transform: 'translate(-50%, -50%) rotate(-45deg)',
      backgroundColor: theme.palette.secondary.main,
      borderRadius: 1,
    },
    '&.disabled:hover': { boxShadow: theme.shadows[0] },
  }),
  btn: { margin: 'auto' },
}));

const oilAndGasAbbrevs = {
  LIGHT: 'CL',
  ISB: 'iSB',
  HEAVY: 'CH',
  CONDENSATE: 'FC',
  C5: 'C5+',
  MB: 'MB',
  CBM: 'CB',
  NA: 'NA',
  SHALE: 'Sh',
  SOLUTION: 'SOL',
  TIGHT: 'Ti',
  All: 'ALL',
};

const ColoredItemBox = ({
  item, icon, color, selected, clear, round,
  attachment, disabled, ...gridProps
}) => {
  const classes = useStyles({ color, round, attachment });
  const Icon = icon;
  const styling = [classes.root, selected && 'selected', disabled && 'disabled'].filter(Boolean).join(' ');
  return (
    <Grid container {...gridProps} className={styling}>
      {clear && <ClearIcon className={classes.btn} />}
      {!clear && icon && <Icon className={classes.btn} />}
      {!clear && !icon && <Typography variant="body2">{oilAndGasAbbrevs[item]}</Typography>}
      {attachment}
    </Grid>
  );
};

ColoredItemBox.propTypes = {
  item: PropTypes.string.isRequired,
  icon: PropTypes.func,
  color: PropTypes.string,
  selected: PropTypes.bool,
  clear: PropTypes.bool,
  round: PropTypes.bool,
  attachment: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  disabled: PropTypes.bool,
};

ColoredItemBox.defaultProps = {
  icon: undefined,
  color: undefined,
  selected: false,
  clear: false,
  round: false,
  attachment: undefined,
  disabled: false,
};

export default ColoredItemBox;
