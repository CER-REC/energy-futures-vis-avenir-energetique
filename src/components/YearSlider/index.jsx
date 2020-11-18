import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { makeStyles, Grid, Typography, IconButton, Slider } from '@material-ui/core';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import useConfig from '../../hooks/useConfig';
import { validYear } from '../../utilities/parseData';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1),
    padding: theme.spacing(0, 1),
    width: `calc(100% - ${theme.spacing(2)}px)`,
  },
  slides: {
    position: 'relative',
    flexGrow: 1,
    padding: theme.spacing(1.5, 1),
    borderLeft: `1px solid ${theme.palette.secondary.light}`,
    borderRight: `1px solid ${theme.palette.secondary.light}`,
    zIndex: 1,
    '& > span': {
      position: 'absolute',
      top: 'calc(50% - 0.5px)',
      left: 0,
      right: 0,
      padding: 0,
    },
  },
  play: {
    padding: 0,
    marginRight: theme.spacing(2),
  },
  rail: {
    height: 1,
    color: theme.palette.secondary.main,
  },
  thumb: {
    backgroundColor: 'transparent',
    cursor: 'grab',
    '&:hover': { boxShadow: theme.shadows[0] },
    '&:active': {
      cursor: 'grabbing',
      boxShadow: theme.shadows[0],
    },
  },
  label: {
    top: -10,
    fontSize: 12,
    '& > span': {
      height: 18,
      borderRadius: 0,
      transform: 'none',
      '&:after': {
        content: '""',
        position: 'absolute',
        top: 18,
        bottom: 'auto',
        width: 0,
        height: 0,
        borderTop: `8px solid ${theme.palette.primary.main}`,
        borderBottom: 'none',
        borderLeft: '4px solid transparent',
        borderRight: '4px solid transparent',
      },
    },
    '& > span > span': {
      transform: 'none',
    },
  },
  bottom: {
    top: 24,
    '& > span:after': {
      top: 'auto',
      bottom: 18,
      borderTop: 'none',
      borderBottom: `8px solid ${theme.palette.secondary.main}`,
    },
  },
  forecast: {
    display: 'flex',
    position: 'absolute',
    top: 12,
    right: 0,
    zIndex: -1,
    padding: theme.spacing(0.25, 0.5),
    backgroundImage: 'linear-gradient(to right, rgba(243, 239, 239, 1), rgba(243, 239, 239, 1) 30%, rgba(243, 239, 239, .25))',
    '& > span': {
      color: '#666',
      lineHeight: 1,
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: 0,
      height: 36,
      width: 1,
      transform: 'translateY(-50%)',
      borderLeft: `1px dashed ${theme.palette.secondary.main}`,
    },
  },
}));

const YearSlider = ({ year, onYearChange, min, max, forecast }) => {
  const classes = useStyles();
  const intl = useIntl();

  const { configDispatch } = useConfig();

  const [currYear, setCurrYear] = useState(year?.curr || year);
  const [compareYear, setCompareYear] = useState(year?.compare || year);
  const [play, setPlay] = useState(false);

  const onCurrYearChange = useCallback((newValue) => {
    const value = validYear(newValue || min, { min, max });
    setCurrYear(value);
    configDispatch({ type: 'baseYear/changed', payload: value });
    onYearChange(year?.curr ? { ...year, curr: value } : value);
  }, [year, setCurrYear, configDispatch, onYearChange, min, max]);

  const onCompareYearChange = useCallback((newValue) => {
    const value = validYear(newValue || min, { min, max });
    setCompareYear(value);
    configDispatch({ type: 'compareYear/changed', payload: value });
    onYearChange({ ...year, compare: value });
  }, [year, setCompareYear, configDispatch, onYearChange, min, max]);

  /**
   * A timer for auto-play.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      if (play && currYear) {
        onCurrYearChange(currYear >= max ? min : currYear + 1);
      }
    }, 500);
    return () => clearInterval(timer);
  }, [max, min, play, currYear, onCurrYearChange]);

  /**
   * A few constant slider props.
   */
  const DEFAULT_PROPS = useMemo(() => ({
    step: 1,
    min: min || 2005,
    max: max || 2050,
    valueLabelDisplay: 'on',
    track: false,
  }), [min, max]);

  /**
   * Determine whether or not it renders double sliders, i.e. with comparison.
   */
  const double = useMemo(() => typeof year === 'object' && year.compare, [year]);

  /**
   * Overriding some styling to achieve the designed look-and-feel.
   */
  const getClasses = useCallback(atBottom => ({
    valueLabel: [classes.label, atBottom && classes.bottom].filter(Boolean).join(' '),
    rail: classes.rail,
    thumb: classes.thumb,
  }), [classes]);

  if (!year) {
    return null;
  }

  return (
    <Grid container alignItems="center" wrap="nowrap" className={classes.root}>
      <Grid item>
        <IconButton color="primary" onClick={() => setPlay(!play)} className={classes.play}>
          {play ? <PauseIcon fontSize="large" /> : <PlayIcon fontSize="large" />}
        </IconButton>
      </Grid>
      <Grid item className={classes.slides}>
        {/* compare slider */}
        {double && (
          <Slider
            value={compareYear}
            onChange={(_, value) => value && onCompareYearChange(value)}
            aria-valuetext={intl.formatMessage({ id: 'common.a11y.sliderYearCompare' })}
            color="secondary"
            {...DEFAULT_PROPS}
            classes={getClasses(true)}
          />
        )}

        {/* current year slider */}
        <Slider
          value={currYear}
          onChange={(_, value) => value && onCurrYearChange(value)}
          aria-valuetext={intl.formatMessage({ id: 'common.a11y.sliderYearCurrent' })}
          {...DEFAULT_PROPS}
          classes={getClasses()}
        />

        {/* forecast bar */}
        {forecast && (
          <div className={classes.forecast} style={{ left: `${((forecast - min) / (max - min)) * 100}%` }}>
            <Typography variant="overline">{intl.formatMessage({ id: 'common.forecast' })}</Typography>
          </div>
        )}
      </Grid>
    </Grid>
  );
};

YearSlider.propTypes = {
  year: PropTypes.oneOfType([
    PropTypes.shape({ // for both current and compared year sliders
      curr: PropTypes.number,
      compare: PropTypes.number, // required for showing the compared slider
    }),
    PropTypes.number, // for a single year slider
  ]).isRequired,
  onYearChange: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  forecast: PropTypes.number,
};

YearSlider.defaultProps = {
  onYearChange: () => {},
  min: 2005,
  max: 2020,
  forecast: undefined,
};

export default YearSlider;
