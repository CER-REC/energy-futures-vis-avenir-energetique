import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Paper, Grid, Typography, Button, Slider } from '@material-ui/core';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import PauseIcon from '@material-ui/icons/PauseCircleOutline';
import { ResponsiveBubble } from '@nivo/circle-packing';

import { CONFIG_REPRESENTATION } from '../../types';
import useConfig from '../../hooks/useConfig';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    height: '100%',
    width: '100%',
    '& > div': {
      position: 'absolute',
      height: 300,
    },
    '& > div:last-of-type': {
      height: 'auto',
      bottom: -41,
      left: -1,
      zIndex: 2,
    },
  },
  year: {
    position: 'absolute',
    top: -10,
    right: -3,
    zIndex: 1,
    paddingLeft: 6,
    backgroundColor: theme.palette.common.white,
  },
  label: {
    position: 'absolute',
    top: '15%',
    left: '85%',
    padding: theme.spacing(0, 0.5),
    border: `1px solid ${theme.palette.secondary.light}`,
    zIndex: 1,
  },
}));

const REGION_LOC = {
  YT: { top: '10%', left: '5%' },
  SK: { top: '60%', left: '25%' },
  QC: { top: 0, left: '50%' },
  PE: { top: '60%', left: '85%' },
  ON: { top: '60%', left: '40%' },
  NU: { top: '15%', left: '28%' },
  NT: { top: '3%', left: '18%' },
  NS: { top: '80%', left: '85%' },
  NL: { top: '35%', left: '80%' },
  NB: { top: '55%', left: '70%' },
  MB: { top: '35%', left: '35%' },
  BC: { top: '65%', left: 0 },
  AB: { top: '30%', left: '5%' },
};
const BUBBLE_SIZE_MIN = 10;
const BUBBLE_SIZE_MAX = 25;

/**
 * Rendering bubble tooltips.
 */
const Tooltip = ({ name, value, unit }) => (
  <Typography style={{ whiteSpace: 'nowrap' }}>
    {name}: {(value / 1000).toFixed(2)} k {CONFIG_REPRESENTATION[unit]}
  </Typography>
);

Tooltip.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
};

const YEAR_MIN = 2005;
const YEAR_MAX = 2040;
const MARKS = Array(8).fill(undefined).map((_, i) => ({ value: YEAR_MIN + i * 5, label: `${YEAR_MIN + i * 5}` }));

/**
 * Rendering each bubble chart for a single province.
 */
const Bubble = ({ province, data, unit }) => (
  <ResponsiveBubble
    root={{ name: province, color: '#FFF', children: data }}
    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    identity="name"
    value="value"
    colors={d => d.color}
    colorBy="name"
    padding={2}
    borderWidth={1}
    borderColor={d => (d.color === 'rgb(255,255,255)' ? '#666' : d.color)}
    enableLabel={false}
    tooltip={d => <Tooltip name={d.id === province ? 'TOTAL' : d.data.name} value={d.value} unit={unit} />}
    isZoomable={false}
    animate
    motionStiffness={90}
    motionDamping={12}
  />
);

Bubble.propTypes = {
  province: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  unit: PropTypes.string,
};

Bubble.defaultProps = {
  province: '',
  data: undefined,
  unit: '',
};

const Electricity = ({ data }) => {
  const classes = useStyles();

  const { config } = useConfig();

  const [year, setYear] = useState(YEAR_MIN);
  const [play, setPlay] = useState(false);

  /**
   * A timer for auto-play.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      if (play) {
        setYear(y => (y >= YEAR_MAX ? YEAR_MIN : y + 1));
      }
    }, 500);
    return () => clearInterval(timer);
  }, [play]);

  /**
   * Post-process for determining bubble sizes and positions.
   */
  const processedData = useMemo(() => {
    if (!data || !data[year]) {
      return undefined;
    }

    const totals = Object.keys(data[year]).reduce((result, province) => ({
      ...result,
      [province]: Object.values(data[year][province])
        .map(entry => entry.value)
        .reduce((a, b) => a + b),
    }), {});

    const max = Math.max(...Object.values(totals));
    const min = Math.min(...Object.values(totals));

    return Object.keys(data[year]).map(province => ({
      name: province,
      size: (Math.abs(max - min) < Number.EPSILON
        ? Number.POSITIVE_INFINITY
        : (totals[province] / (max - min)) * BUBBLE_SIZE_MAX + BUBBLE_SIZE_MIN),
      children: Object.values(data[year][province]),
    }));
  }, [data, year]);

  if (!data) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Typography variant="h3" color="primary" className={classes.year}>{`${year} `}</Typography>

      {processedData.map(entry => (
        <div
          key={`bubble-${entry.name}`}
          style={{
            height: entry.size === Number.POSITIVE_INFINITY ? '80%' : `${entry.size * 8}px`,
            width: entry.size === Number.POSITIVE_INFINITY ? '80%' : `${entry.size * 8}px`,
            top: entry.size === Number.POSITIVE_INFINITY ? '10%' : REGION_LOC[entry.name].top,
            left: entry.size === Number.POSITIVE_INFINITY ? '10%' : REGION_LOC[entry.name].left,
          }}
        >
          <Bubble province={entry.name} data={entry.children} unit={config.unit} />
          <Paper square elevation={0} className={classes.label}>
            <Typography>{entry.name}</Typography>
          </Paper>
        </div>
      ))}

      <Grid container alignItems="flex-start" spacing={6}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={play ? <PauseIcon /> : <PlayIcon />}
            onClick={() => setPlay(!play)}
          >
            {play ? 'Stop' : 'Play'}
          </Button>
        </Grid>
        <Grid item style={{ flexGrow: 1 }}>
          <Slider
            value={year}
            onChange={(_, value) => value && setYear(value)}
            aria-labelledby="year select slider"
            aria-valuetext="current selected year"
            step={1}
            marks={MARKS}
            min={YEAR_MIN}
            max={YEAR_MAX}
            valueLabelDisplay="on"
          />
        </Grid>
      </Grid>
    </div>
  );
};

Electricity.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
};

Electricity.defaultProps = {
  data: undefined,
};

export default Electricity;
