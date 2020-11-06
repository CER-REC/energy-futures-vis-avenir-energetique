import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles, createStyles, Grid, Button, Typography,
} from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const useStyles = makeStyles(theme => createStyles({
  title: {
    color: theme.palette.primary.main,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  btnContainer: {
    position: 'relative',
    width: '100%',
    lineHeight: 0,
  },
  btn: {
    height: 26,
    width: '100%',
    minWidth: 0,
    padding: theme.spacing(0.25, 1),
    fontSize: 12,
    textTransform: 'capitalize',
    justifyContent: 'left',
  },
  btnIcon: {
    'button&': {
      height: 22,
      width: 24,
      padding: theme.spacing(0, 0.5),
      '&:hover': { boxShadow: 'none' },
    },
    '& svg': { fontSize: 16 },
  },
  btnPopUp: {
    position: 'absolute',
    top: '50%',
    left: 'calc(100% - 10px)',
    maxHeight: 350,
    width: 300,
    padding: theme.spacing(1.5, 2, 1.5, 1.5),
    transform: 'translate(26px, -50%)',
    zIndex: theme.zIndex.modal,
    border: `1px solid ${theme.palette.secondary.light}`,
    backgroundColor: '#F3EFEF',
    overflow: 'auto',
    '& h4': { marginTop: 0 },
    '& p, & li': {
      fontSize: 12,
      lineHeight: 1.1,
      '&:not(.MuiTypography-root)': { marginBottom: 0 },
    },
    '& li': { margin: theme.spacing(0.5, 0) },
    '& img': { width: '100%' },
  },
  btnPopUpTip: {
    position: 'absolute',
    top: '50%',
    left: '100%',
    height: `calc(100% - ${theme.spacing(1)}px)`,
    width: 17,
    transform: 'translate(0px, -50%)',
    border: `1px solid ${theme.palette.secondary.light}`,
    borderLeft: `1px solid ${theme.palette.secondary.light}`,
    borderRight: 'none',
    backgroundColor: '#F3EFEF',
    zIndex: theme.zIndex.modal + 1,
  },
  btnIconPopUpTip: { height: '100% !important' },
  accent: {
    width: 8,
    backgroundColor: theme.palette.primary.main,
    '& + div': { width: `calc(100% - ${theme.spacing(1)}px)` },
  },
}));

const LinkButtonGroup = ({ title, labels, className }) => {
  const classes = useStyles();

  const [select, setSelect] = useState(undefined);

  const handleSelect = useCallback(
    label => () => select !== label.name && typeof label.content === 'object' && setSelect(label.name),
    [select, setSelect],
  );

  /**
   * This is a button group in which buttons share the same accent color bar.
   */
  const generateLebelGroup = labelGroup => (
    <Grid container>
      <Grid item className={classes.accent} />
      <Grid item>
        <Grid
          container
          direction="column"
          alignItems="flex-start"
          spacing={labelGroup[0].icon ? 0 : 1}
        >
          {labelGroup.map(label => (
            <Grid item key={`link-button-${label.name}`} className={classes.btnContainer}>
              <Button
                variant="contained"
                color={select === label.name ? 'primary' : 'secondary'}
                onClick={typeof label.content === 'function' ? label.content : handleSelect(label)}
                onMouseEnter={handleSelect(label)}
                className={`${classes.btn} ${label.icon && classes.btnIcon}`}
              >
                {label.icon || label.name}
              </Button>

              <span style={{ display: select === label.name ? 'block' : 'none' }}>
                <div className={classes.btnPopUp}>
                  {typeof label.content === 'object' && label.content}
                </div>
                <div className={`${classes.btnPopUpTip} ${label.icon && classes.btnIconPopUpTip}`} />
              </span>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <ClickAwayListener onClickAway={() => setSelect(undefined)}>
      <Grid
        container
        direction="column"
        alignItems="flex-start"
        spacing={1}
        className={className}
      >
        {title && (
          <Grid item xs={12}>
            <Typography variant="body1" color="primary" className={classes.title}>{title}</Typography>
          </Grid>
        )}
        {labels.map(labelGroup => <Grid item key={`link-button-group-${Math.random()}`}>{generateLebelGroup(labelGroup)}</Grid>)}
      </Grid>
    </ClickAwayListener>
  );
};

LinkButtonGroup.propTypes = {
  title: PropTypes.string,
  labels: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.element,
    name: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  }))),
  className: PropTypes.string, // root class names
};

LinkButtonGroup.defaultProps = {
  title: undefined,
  labels: [],
  className: undefined,
};

export default LinkButtonGroup;
