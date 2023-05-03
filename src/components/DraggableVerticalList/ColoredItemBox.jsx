import React from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles, Grid, Typography,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import DotsIcon from '@material-ui/icons/MoreHoriz';

const hexagon = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

const useStyles = makeStyles(theme => ({
  shadow: {
    transition: 'filter .25s ease-in-out',
    '&:hover': {
      filter: `drop-shadow(0 3px 3px rgba(0, 0, 0, 0.3))
               drop-shadow(0 6px 6px rgba(0, 0, 0, 0.2))`,
    },
  },
  shape: props => ({
    position: 'absolute',
    height: 36,
    width: 36,
    backgroundColor: theme.palette.common.white,
    border: `2px solid ${props.color || theme.palette.secondary.main}`,
    '&.circle': {
      borderRadius: '50%',
      '&.disabled:before': { width: '105%' },
    },
    '&.hexagon': {
      backgroundColor: props.color || theme.palette.secondary.main,
      clipPath: hexagon,
      '&:after, &.selected.disabled:after': {
        backgroundColor: theme.palette.common.white,
        clipPath: hexagon,
        content: '""',
        height: '100%',
        position: 'absolute',
        width: '100%',
        zIndex: -1,
      },
      '&.selected:after': { content: 'none' },
      '&.disabled': { backgroundColor: theme.palette.secondary.main },
    },
    '&.circle, &.hexagon': {
      '&.disabled > p, &.disabled > svg': { backgroundColor: 'transparent' },
    },
    textTransform: 'uppercase',
    '& > p, & > svg:first-of-type': {
      margin: props.attachment ? 4 : 'auto',
      color: props.color || theme.palette.secondary.main,
    },
    '&.selected': { backgroundColor: props.color || theme.palette.secondary.main },
    '&.selected > p, &.selected > svg': { color: theme.palette.common.white },

    '&.disabled': {
      borderColor: theme.palette.secondary.main,
      backgroundColor: theme.palette.common.white,
    },
    '&.disabled > p, &.disabled > svg': {
      color: theme.palette.secondary.main,
      backgroundColor: theme.palette.common.white,
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
      width: '152%',
      transform: 'translate(-50%, -50%) rotate(-45deg)',
      backgroundColor: theme.palette.secondary.main,
      borderRadius: 1,
    },
  }),
  grasp: props => ({
    position: 'absolute',
    bottom: -7,
    left: '50%',
    transform: 'translate(-50%, 0)',
    color: props.color || theme.palette.secondary.main,
    'svg&': { backgroundColor: 'transparent !important' },
  }),
}));

const ColoredItemBox = ({
  item, icon, color, selected, clear, shape,
  attachment, disabled, draggable, ...gridProps
}) => {
  const classes = useStyles({ color, attachment });
  const Icon = icon;
  const styling = [classes.shape, selected && 'selected', shape, disabled && 'disabled'].filter(Boolean).join(' ');
  return (
    <div className={disabled ? '' : classes.shadow}>
      <Grid container {...gridProps} className={styling}>
        {clear && <ClearIcon className={classes.btn} />}
        {!clear && icon && <Icon style={{ margin: draggable ? '2px auto' : 'auto' }} />}
        {!clear && !icon && <Typography variant="body2">{item}</Typography>}
        {!clear && draggable && <DotsIcon fontSize="small" className={classes.grasp} />}
        {attachment}
      </Grid>
    </div>
  );
};

ColoredItemBox.propTypes = {
  item: PropTypes.string.isRequired,
  icon: PropTypes.func,
  color: PropTypes.string,
  selected: PropTypes.bool,
  clear: PropTypes.bool,
  shape: PropTypes.oneOf(['square', 'circle', 'hexagon']),
  attachment: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  disabled: PropTypes.bool,
  draggable: PropTypes.bool,
};

ColoredItemBox.defaultProps = {
  icon: undefined,
  color: undefined,
  selected: false,
  clear: false,
  shape: 'square',
  attachment: undefined,
  disabled: false,
  draggable: false,
};

export default ColoredItemBox;
