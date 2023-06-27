import React from 'react';
import {
  MenuItem,
  Select,
  makeStyles,
} from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  selectContainer: {
    margin: '0 0.25em',
    fontSize: '13px',
    height: '26px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderRadius: 0,
      top: 0,
      ...theme.mixins.selectBorder,
    },
  },
  root: {
    padding: '0.2em 0.5em',
  },
  item: {
    fontSize: '13px',
    '&.Mui-selected': { backgroundColor: 'transparent' },
    '&:hover, &.Mui-selected:hover, &.Mui-focusVisible': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
    },
  },
  menu: {
    background: '#F8F8F8',
    borderRadius: 0,
    ...theme.mixins.selectBorder,
  },
}));

const DropDown = ({ options, value, onChange, className, menuClassName, renderValue }) => {
  const classes = useStyles();

  return (
    <Select
      className={clsx(classes.selectContainer, className)}
      variant="outlined"
      value={value}
      renderValue={renderValue}
      onChange={({ target: { value: targetValue } }) => onChange(targetValue)}
      MenuProps={{
        classes: {
          paper: clsx(classes.menu, menuClassName),
        },
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        autoFocus: false,
        getContentAnchorEl: null,
      }}
      classes={{
        root: classes.root,
      }}
      IconComponent={KeyboardArrowDown}
    >
      {
          options.map(([label, optionValue]) => (
            <MenuItem
              classes={{ root: classes.item }}
              key={optionValue}
              value={optionValue}
            >
              {label}
            </MenuItem>
          ))
        }
    </Select>
  );
};

DropDown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  menuClassName: PropTypes.string,
  renderValue: PropTypes.func,
};

DropDown.defaultProps = {
  value: null,
  className: '',
  menuClassName: '',
  renderValue: null,
};

export default DropDown;
