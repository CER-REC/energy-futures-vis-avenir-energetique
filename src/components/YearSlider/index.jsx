import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, createStyles, Grid, IconButton, Slider } from '@material-ui/core';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import PauseIcon from '@material-ui/icons/PauseCircleOutline';

const useStyles = makeStyles(theme => createStyles({
  root: { width: 'auto' },
  tooltip: { margin: theme.spacing(-0.5, 0.5, 0) },
  icon: {
    fontSize: '1rem',
    color: theme.palette.secondary.light,
  },
}));

const YearSlider = ({ year, onYearChange, min, max }) => {
  const classes = useStyles();

  const [currYear, setCurrYear] = useState(year.curr);
  const [compareYear, setCompareYear] = useState(year.compare);
  const [play, setPlay] = useState(false);

  /**
   * Generate slide marks for the video playback control.
   */
  const marks = useMemo(() => Array((max - min) / 5 + 1)
    .fill(undefined)
    .map((_, i) => ({ value: min + i * 5, label: `${min + i * 5}` })), [min, max]);

  /**
   * A timer for auto-play.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      if (play && currYear) {
        onCurrYearChange(currYear >= max ? min : currYear + 1)
      }
    }, 500);
    return () => clearInterval(timer);
  }, [play, currYear]);

  const onCurrYearChange = (value) => {
    setCurrYear(value);
    onYearChange({ ...year, curr: value });
  };

  const onCompareYearChange = (value) => {
    setCompareYear(value);
    onYearChange({ ...year, compare: value });
  };

  return (
    <Grid container alignItems="center" wrap="nowarp" spacing={2}>
      <Grid item>
        <IconButton
          color="primary" size="large"
          onClick={() => setPlay(!play)}
          // className={classes.btnPlay}
        >
          {play ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
      </Grid>
      <Grid item style={{ flexGrow: 1 }}>
        <Slider
          value={currYear}
          onChange={(_, value) => value && onCurrYearChange(value)}
          aria-labelledby="year select slider"
          aria-valuetext="current selected year"
          step={1}
          // marks={marks}
          min={min}
          max={max}
          valueLabelDisplay="on"
        />
      </Grid>
    </Grid>
  );
};

YearSlider.propTypes = {
  year: PropTypes.shape({
    curr: PropTypes.number,
    compare: PropTypes.number,
  }).isRequired,
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
