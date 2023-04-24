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
    fontSize: '1.5rem',
    '& .MuiOutlinedInput-notchedOutline': {
      borderRadius: 0,
      top: 0,
      ...theme.mixins.selectBorder,
    },
  },
  root: {
    padding: '0.5em',
  },
  item: {
    fontSize: 'inherit',
    '&.Mui-selected': { backgroundColor: 'transparent' },
    '&.Mui-focusVisible': { backgroundColor: theme.palette.action.hover },
  },
  menu: {
    background: '#F8F8F8',
    borderRadius: 0,
    ...theme.mixins.selectBorder,
  },
}));

const DropDown = ({ options, value, onChange, className, menuClassName }) => {
  const classes = useStyles();

  return (
    <Select
      className={clsx(classes.selectContainer, className)}
      variant="outlined"
      value={value}
      onChange={({ target: { value: yearId } }) => onChange(yearId)}
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
};

DropDown.defaultProps = {
  value: null,
  className: '',
  menuClassName: '',
};

export default DropDown;
