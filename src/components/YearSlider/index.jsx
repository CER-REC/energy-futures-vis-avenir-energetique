import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { makeStyles, Grid, Typography, IconButton, Slider } from '@material-ui/core';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import useConfig from '../../hooks/useConfig';
import analytics from '../../analytics';
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
  historical: {
    ...theme.mixins.yearSliderLabels,
    backgroundColor: theme.palette.historical,
  },
  forecast: {
    ...theme.mixins.yearSliderLabels,
    backgroundColor: theme.palette.background.light,
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

const YearSlider = ({ year, min, max, forecast }) => {
  const classes = useStyles();
  const intl = useIntl();

  const {
    config: { page, yearId, compareYear, baseYear },
    configDispatch,
  } = useConfig();

  const [currYear, setCurrYear] = useState(year?.curr || year);
  const [compYear, setCompYear] = useState(year?.compare || year);
  const [play, setPlay] = useState(false);

  const iteration = useMemo(() => parseInt(yearId, 10), [yearId]);

  const onCurrYearChange = useCallback((newValue) => {
    const value = validYear(newValue || min, { min, max });
    setCurrYear(value);
    configDispatch({ type: 'baseYear/changed', payload: value });

    /*
    * If only one slider is changed, the other needs a value otherwise
    * it will reset on iteration change
    */
    if (!compareYear) {
      configDispatch({ type: 'compareYear/changed', payload: max });
      setCompYear(max);
    }
  }, [min, max, configDispatch, compareYear]);

  const onCompareYearChange = useCallback((newValue) => {
    const value = validYear(newValue || min, { min, max });
    setCompYear(value);
    configDispatch({ type: 'compareYear/changed', payload: value });

    /*
    * If only one slider is changed, the other needs a value otherwise
    * it will reset on iteration change
    */
    if (!baseYear) {
      configDispatch({ type: 'baseYear/changed', payload: iteration });
      setCurrYear(iteration);
    }
  }, [min, max, configDispatch, baseYear, iteration]);

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

  const handlePlay = useCallback(() => {
    setPlay(!play);
    analytics.reportMedia(page, play ? 'pause' : 'play');
  }, [play, setPlay, page]);

  if (!baseYear && !compareYear && iteration && max) {
    if (currYear !== iteration) {
      setCurrYear(iteration);
    }
    if (compYear !== max) {
      setCompYear(max);
    }
  }

  if (!year) {
    return null;
  }

  return (
    <Grid container alignItems="center" wrap="nowrap" className={classes.root}>
      <Grid item>
        <IconButton color="primary" onClick={handlePlay} className={classes.play}>
          {play ? <PauseIcon fontSize="large" /> : <PlayIcon fontSize="large" />}
        </IconButton>
      </Grid>
      <Grid item className={classes.slides}>
        {/* compare slider */}
        {double && (
          <Slider
            value={compYear}
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

        <div className={classes.historical}>
          <Typography variant="overline" style={{ textTransform: 'uppercase' }}>{intl.formatMessage({ id: 'components.historicalLayer.historical' })}</Typography>
        </div>

        {/* forecast bar */}
        {forecast && (
          <div className={classes.forecast} style={{ left: `${((forecast - min) / (max - min)) * 100}%` }}>
            <Typography variant="overline" style={{ textTransform: 'uppercase' }}>{intl.formatMessage({ id: 'common.forecast' })}</Typography>
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
  min: PropTypes.number,
  max: PropTypes.number,
  forecast: PropTypes.number,
};

YearSlider.defaultProps = {
  min: 2005,
  max: 2020,
  forecast: undefined,
};

export default YearSlider;
