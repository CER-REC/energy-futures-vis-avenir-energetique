import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Grid, IconButton, Slider } from '@material-ui/core';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1),
    padding: theme.spacing(0, 1),
    width: `calc(100% - ${theme.spacing(2)}px)`,
    backgroundColor: '#F3EFEF',
  },
  slides: {
    position: 'relative',
    flexGrow: 1,
    padding: theme.spacing(1.5, 1),
    borderLeft: `1px solid ${theme.palette.secondary.light}`,
    borderRight: `1px solid ${theme.palette.secondary.light}`,
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
    marginRight: theme.spacing(1),
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
}));

const YearSlider = ({ year, onYearChange, min, max }) => {
  const classes = useStyles();

  const [currYear, setCurrYear] = useState(year?.curr || year);
  const [compareYear, setCompareYear] = useState(year?.compare);
  const [play, setPlay] = useState(false);

  const onCurrYearChange = useCallback((value) => {
    setCurrYear(value);
    onYearChange(year?.curr ? { ...year, curr: value } : value);
  }, [year, setCurrYear, onYearChange]);

  const onCompareYearChange = useCallback((value) => {
    setCompareYear(value);
    onYearChange({ ...year, compare: value });
  }, [year, setCompareYear, onYearChange]);

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
    min,
    max,
    valueLabelDisplay: 'on',
    track: false,
  }), [min, max]);

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
    <Grid container alignItems="center" wrap="nowrap" spacing={0} className={classes.root}>
      <Grid item>
        <IconButton color="primary" onClick={() => setPlay(!play)} className={classes.play}>
          {play ? <PauseIcon fontSize="large" /> : <PlayIcon fontSize="large" />}
        </IconButton>
      </Grid>
      <Grid item className={classes.slides}>
        {typeof year === 'object' && year.compare && (
          <Slider
            value={compareYear}
            onChange={(_, value) => value && onCompareYearChange(value)}
            aria-labelledby="year select slider (compare)"
            aria-valuetext="year selected for comparison"
            color="secondary"
            {...DEFAULT_PROPS}
            classes={getClasses(true)}
          />
        )}
        <Slider
          value={currYear}
          onChange={(_, value) => value && onCurrYearChange(value)}
          aria-labelledby="year select slider (current)"
          aria-valuetext="current selected year"
          {...DEFAULT_PROPS}
          classes={getClasses()}
        />
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
};

YearSlider.defaultProps = {
  onYearChange: undefined,
  min: 2005,
  max: 2020,
};

export default YearSlider;
