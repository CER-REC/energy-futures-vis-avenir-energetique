import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles, Paper, Grid, Typography, Tooltip, Button, Slider,
} from '@material-ui/core';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import PauseIcon from '@material-ui/icons/PauseCircleOutline';

import { UNIT_NAMES } from '../../constants';
import { formatUnitAbbreviation } from '../../utilities/convertUnit';
import useAPI from '../../hooks/useAPI';
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
  region: {
    position: 'relative',
    transition: 'top .25s ease-in-out, left .25s ease-in-out, height .25s ease-in-out, width .25s ease-in-out',
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      boxShadow: theme.shadows[1],
    },
  },
  subregion: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    transition: 'top .25s ease-in-out, left .25s ease-in-out, height .25s ease-in-out, width .25s ease-in-out',
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
    top: -35,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: theme.spacing(0, 0.5),
    border: `1px solid ${theme.palette.secondary.light}`,
    zIndex: 1,
  },
  btnPlay: {
    height: 26,
    padding: 0,
  },
}));

const COORD = {
  YT: { top: '10%', left: '5%' },
  SK: { top: '60%', left: '25%' },
  QC: { top: '5%', left: '55%' },
  PE: { top: '65%', left: '88%' },
  ON: { top: '60%', left: '45%' },
  NU: { top: '15%', left: '30%' },
  NT: { top: '3%', left: '18%' },
  NS: { top: '80%', left: '85%' },
  NL: { top: '35%', left: '85%' },
  NB: { top: '55%', left: '70%' },
  MB: { top: '35%', left: '35%' },
  BC: { top: '70%', left: '8%' },
  AB: { top: '30%', left: '8%' },

  BIO: { top: '10%', left: '60%' },
  COAL: { top: '70%', left: '55%' },
  GAS: { top: '15%', left: '80%' },
  HYDRO: { top: '45%', left: '15%' },
  NUCLEAR: { top: '5%', left: '35%' },
  OIL: { top: '20%', left: '10%' },
  RENEWABLE: { top: '50%', left: '75%' },
};

const BUBBLE_SIZE = {
  region: { MAX: 20, MIN: 1 },
  source: { MAX: 30, MIN: 0 },
  single: 20,
};

/**
 * Rendering bubble tooltips.
 */
const Legend = ({ entry, unit }) => (
  <Grid container direction="column" spacing={1}>
    {[...entry.nodes, { name: 'Total', value: entry.value }].map((node) => {
      const value = formatUnitAbbreviation(node.value);
      const suffix = node.name === 'Total' ? UNIT_NAMES[unit] : `(${((node.value / entry.value) * 100).toFixed(1)}%)`;
      return (
        <Grid item key={`legend-item-${node.name}`}>
          <Grid container alignItems="center" wrap="nowrap">
            <div style={{ height: 16, width: 16, backgroundColor: node.color || 'white', marginRight: 6 }} />
            <strong>{node.name}:</strong>&nbsp;
            {`${value} ${suffix}`}
          </Grid>
        </Grid>
      );
    })}
  </Grid>
);

Legend.propTypes = {
  entry: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    nodes: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    })).isRequired,
  }).isRequired,
  unit: PropTypes.string,
};

Legend.defaultProps = {
  unit: '',
};

const Electricity = ({ data, year }) => {
  const classes = useStyles();

  const {
    sources: { electricity: { colors: colorSources } },
    regions: { colors: colorRegions },
  } = useAPI();
  const { config } = useConfig();

  const [currYear, setCurrYear] = useState(year?.min || 2005);
  const [play, setPlay] = useState(false);

  useEffect(() => setCurrYear(year?.min || 2005), [year]);

  /**
   * Generate slide marks for the video playback control.
   */
  const marks = useMemo(() => year && Array((year.max - year.min) / 5 + 1)
    .fill(undefined)
    .map((_, i) => ({ value: year.min + i * 5, label: `${year.min + i * 5}` })), [year]);

  /**
   * A timer for auto-play.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      if (play && year) {
        setCurrYear(y => (y >= year.max ? year.min : y + 1));
      }
    }, 500);
    return () => clearInterval(timer);
  }, [play, year]);

  /**
   * Looking for the min and max value and the total volumns in each group (region or source).
   */
  const { totals, max, min } = useMemo(() => {
    if (!data || !data[currYear]) {
      return { totals: undefined, max: Number.POSITIVE_INFINITY, min: Number.NEGATIVE_INFINITY };
    }

    const allValues = Object.keys(data[currYear]).reduce((result, view) => ({
      ...result,
      [view]: Object.values(data[currYear][view]) // 'view' can be 'region' or 'source'
        .map(entry => entry.value)
        .reduce((a, b) => a + b),
    }), {});

    return {
      totals: allValues,
      max: Math.max(...Object.values(allValues)),
      min: Math.min(...Object.values(allValues)),
    };
  }, [data, currYear]);

  /**
   * Determine whether not not a single bubble group is shown.
   */
  const single = useMemo(() => Math.abs(max - min) < Number.EPSILON, [max, min]);

  /**
   * Determine the min and max bubble size based on the current view select.
   */
  const sizeMin = useMemo(() => BUBBLE_SIZE[config.view].MIN, [config.view]);
  const sizeMax = useMemo(
    () => (single ? BUBBLE_SIZE.single : BUBBLE_SIZE[config.view].MAX),
    [config.view, single],
  );

  /**
   * Calculate the screen pixel size of a bubble based on its numeric value.
   */
  const getSize = useCallback(
    value => Math.sqrt(value / (single ? max / 2 : max - min)) * sizeMax + sizeMin,
    [max, min, sizeMax, sizeMin, single],
  );

  /**
   * A method determines whether or not a bubble is selected.
   */
  const isIncluded = useCallback(
    name => (config.view === 'source' ? config.provinces : config.sources).includes(name),
    [config.view, config.provinces, config.sources],
  );

  /**
   * Post-process for determining each bubble sizes and positions.
   */
  const processedData = useMemo(() => {
    const dataWithPosition = totals ? Object.keys(data[currYear]).map((province) => {
      const size = getSize(totals[province]);
      return {
        name: province,
        size,
        value: totals[province],
        nodes: data[currYear][province].sort((a, b) => b.value - a.value).map(source => ({
          ...source,
          size: getSize(source.value),
          color: { ...colorSources, ...colorRegions }[source.name],
        })),
        style: {
          height: size * 8,
          width: size * 8,
          top: single ? 'calc(50% - 120px)' : COORD[province].top,
          left: single ? 'calc(50% - 200px)' : COORD[province].left,
        },
      };
    }) : [];
    return dataWithPosition;
  }, [data, colorSources, colorRegions, currYear, getSize, single, totals]);

  if (!data || !processedData || processedData.length <= 0) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Typography variant="h4" color="primary" className={classes.year}>{`${currYear} `}</Typography>

      {processedData.map(entry => (
        <Tooltip key={`bubble-${entry.name}`} title={single ? '' : <Legend entry={entry} unit={config.unit} />}>
          <div className={classes.region} style={entry.style}>
            {entry.nodes.map((node, index, list) => {
              /**
               * This simplified algorithm uses the chord length as an approximate of the
               * corresponding arc length. Starting from the biggest bubble, it calculates
               * the coordinates of the bubble centers along the perimeter of the circle
               * in sequence.
               *
               * Theta is the angle (in radius) spans between the center of the first bubble
               * and the center of the current bubble, which accumulates when moving from one
               * bubble to the next. Because the center of the first bubble is fixed, we can
               * use theta to calculate the xy-coordinates of the current bubble center using
               * trigonometry.
               */
              const theta = index === 0 ? 0 : Array(index + 1)
                .fill(undefined)
                .reduce((sum, _, i) => {
                  const offset = isIncluded(list[i].name)
                    ? ((i === 0 || i === index) ? 1 : 2) * (entry.nodes[i].size / entry.size) * 1.1
                    : 0;
                  return sum + offset;
                }, 0);
              const x = Number.isNaN(theta) ? 0 : entry.size * 4 * (1 - Math.cos(theta));
              const y = Number.isNaN(theta) ? 0 : entry.size * 4 * Math.sin(theta);
              return (
                <div
                  key={`region-${entry.name}-source-${node.name}`}
                  className={classes.subregion}
                  style={{
                    top: entry.size * 4 + y,
                    left: x,
                    height: isIncluded(node.name) ? node.size * 8 : 0,
                    width: isIncluded(node.name) ? node.size * 8 : 0,
                    backgroundColor: node.color,
                  }}
                />
              );
            })}

            {/* province name */}
            <Paper square elevation={0} className={classes.label}>
              <Typography>{entry.name}</Typography>
            </Paper>

            {/* static legend shown beside a single province */}
            {single && (
              <div style={{ position: 'absolute', bottom: 0, right: 'calc(-100% - 100px)' }}>
                <Legend entry={entry} unit={config.unit} />
              </div>
            )}
          </div>
        </Tooltip>
      ))}

      {/* below are the controls for the year playback */}
      <Grid container alignItems="flex-start" spacing={6}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={play ? <PauseIcon /> : <PlayIcon />}
            onClick={() => setPlay(!play)}
            className={classes.btnPlay}
          >
            {play ? 'Stop' : 'Play'}
          </Button>
        </Grid>
        <Grid item style={{ flexGrow: 1 }}>
          <Slider
            value={currYear}
            onChange={(_, value) => value && setCurrYear(value)}
            aria-labelledby="year select slider"
            aria-valuetext="current selected year"
            step={1}
            marks={marks}
            min={year.min}
            max={year.max}
            valueLabelDisplay="on"
          />
        </Grid>
      </Grid>
    </div>
  );
};

Electricity.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  year: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number }),
};

Electricity.defaultProps = {
  data: undefined,
  year: undefined,
};

export default Electricity;
