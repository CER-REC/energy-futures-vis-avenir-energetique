import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles, createStyles, Grid, Button, Typography,
} from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ReportLinkImage from './report-link.png';

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
  btn: props => ({
    height: 26,
    width: '100%',
    minWidth: 0,
    padding: theme.spacing(0.25, 1),
    fontSize: 12,
    textTransform: 'capitalize',
    justifyContent: props.accent || 'right',
  }),
  btnIcon: {
    'button&': {
      height: 22,
      width: 24,
      padding: theme.spacing(0, 0.5),
      '&:hover': { boxShadow: 'none' },
    },
    '& svg': { fontSize: 16 },
  },
  btnPopUp: props => ({
    position: 'absolute',
    top: '50%',
    left: props.accent === 'left' ? 'calc(100% - 10px)' : 'auto',
    right: props.accent !== 'left' ? 'calc(100% - 10px)' : 'auto',
    width: 250,
    padding: theme.spacing(1.5, 2, 1.5, 1.5),
    transform: `translate(${props.accent === 'left' ? 26 : -26}px, -50%)`,
    zIndex: theme.zIndex.modal,
    border: `1px solid ${theme.palette.secondary.light}`,
    backgroundColor: '#F3EFEF',
    overflow: 'auto',
    '& p': {
      fontSize: 12,
      lineHeight: 1.1,
    },
    '& img': { width: '100%' },
  }),
  btnPopUpTip: props => ({
    position: 'absolute',
    top: '50%',
    left: props.accent === 'left' ? '100%' : 'auto',
    right: props.accent !== 'left' ? '100%' : 'auto',
    height: `calc(100% - ${theme.spacing(1)}px)`,
    width: 17,
    transform: 'translate(0px, -50%)',
    border: `1px solid ${theme.palette.secondary.light}`,
    borderLeft: props.accent === 'left' ? `1px solid ${theme.palette.secondary.light}` : 'none',
    borderRight: props.accent !== 'left' ? `1px solid ${theme.palette.secondary.light}` : 'none',
    backgroundColor: '#F3EFEF',
    zIndex: theme.zIndex.modal + 1,
  }),
  btnIconPopUpTip: { height: '100% !important' },
  accent: {
    width: 8,
    backgroundColor: theme.palette.primary.main,
    '& + div': { width: `calc(100% - ${theme.spacing(1)}px)` },
  },
}));

const LinkButtonGroup = ({ title, labels, accent, className }) => {
  const classes = useStyles({ accent });

  const [select, setSelect] = useState(undefined);

  const handleSelect = useCallback(
    label => () => select !== (label.name || label) && setSelect(label.name || label),
    [select, setSelect],
  );

  /**
   * This is a button group in which buttons share the same accent color bar.
   */
  const generateLebelGroup = labelGroup => (
    <Grid container>
      {accent === 'left' && <Grid item className={classes.accent} />}
      <Grid item>
        <Grid
          container
          direction="column"
          alignItems={accent === 'left' ? 'flex-start' : 'flex-end'}
          spacing={labelGroup[0].icon ? 0 : 1}
        >
          {labelGroup.map(label => (
            <Grid item key={`link-button-${label.name || label}`} className={classes.btnContainer}>
              <Button
                variant="contained"
                color={select === (label.name || label) ? 'primary' : 'secondary'}
                onClick={handleSelect(label.name || label)}
                onMouseEnter={handleSelect(label.name || label)}
                className={`${classes.btn} ${label.icon && classes.btnIcon}`}
              >
                {label.icon || label}
              </Button>

              {/* TODO: placeholder; this will be replaced with real content */}
              <span style={{ display: select === (label.name || label) ? 'block' : 'none' }}>
                <div className={classes.btnPopUp}>
                  <Typography varaint="body2" color="secondary" gutterBottom>
                    Energy Future includes a wide range of projections for Canadian energy supply
                    and demand. Theme projects are the result of a modeling system consisting of
                    several interactive components (or modules) which produce integrated, future
                    Canadian energy trends.
                  </Typography>
                  <Grid container alignItems="flex-end" wrap="nowrap" spacing={1}>
                    <Grid item xs={5}><img src={ReportLinkImage} alt="report link" /></Grid>
                    <Grid item xs={7}>
                      <Typography varaint="body2" color="secondary">
                        DOWNLOAD THE COMPLETE REPORT HERE
                      </Typography>
                    </Grid>
                  </Grid>
                </div>
                <div className={`${classes.btnPopUpTip} ${label.icon && classes.btnIconPopUpTip}`} />
              </span>
            </Grid>
          ))}
        </Grid>
      </Grid>
      {accent !== 'left' && <Grid item className={classes.accent} />}
    </Grid>
  );

  return (
    <ClickAwayListener onClickAway={() => setSelect(undefined)}>
      <Grid
        container
        direction="column"
        alignItems={accent === 'left' ? 'flex-start' : 'flex-end'}
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
  labels: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape({
    icon: PropTypes.element,
    name: PropTypes.string,
  }), PropTypes.string]))),
  accent: PropTypes.string, // 'left', 'right'
  className: PropTypes.string, // root class names
};

LinkButtonGroup.defaultProps = {
  title: undefined,
  labels: [],
  accent: 'left',
  className: undefined,
};

export default LinkButtonGroup;
