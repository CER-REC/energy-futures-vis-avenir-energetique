import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  makeStyles, useMediaQuery, Paper, Grid, Typography, Tooltip,
} from '@material-ui/core';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import analytics from '../../analytics';
import YearSlider from '../../components/YearSlider';
import VizTooltip from '../../components/VizTooltip';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    height: '100%',
    width: '100%',
    '& > div': { position: 'absolute' },
    '& > div:last-of-type': {
      height: 'auto',
      bottom: 0,
      left: 0,
      right: 0,
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
      border: `1px solid ${theme.palette.secondary.light}`,
      boxShadow: theme.shadows[2],
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
    top: theme.spacing(0.5),
    right: theme.spacing(1),
    zIndex: 1,
    paddingLeft: 6,
    fontWeight: 700,
    backgroundColor: theme.palette.common.white,
  },
  annotation: {
    position: 'absolute',
    top: theme.spacing(4.5),
    right: theme.spacing(1),
    width: 100,
    zIndex: 1,
    padding: theme.spacing(0.5),
    border: `1px solid ${theme.palette.secondary.light}`,
    lineHeight: 1,
    '& span': {
      fontWeight: 700,
      lineHeight: 1,
      textTransform: 'uppercase',
    },
    '& > div:first-of-type': { height: 50 },
    '& > div:last-of-type': { textAlign: 'right' },
  },
  annotationCircle: {
    position: 'absolute',
    top: theme.spacing(0.5),
    height: 50,
    width: 50,
    borderRadius: '50%',
    '&:first-of-type': {
      left: theme.spacing(0.5),
      backgroundColor: theme.palette.secondary.light,
    },
    '&:last-of-type': {
      right: theme.spacing(0.5),
      border: `1px solid ${theme.palette.secondary.light}`,
      boxShadow: theme.shadows[2],
    },
  },
  tooltip: { maxWidth: 'none' },
  label: {
    position: 'absolute',
    top: -40,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: theme.spacing(0, 0.5),
    border: `1px solid ${theme.palette.secondary.light}`,
    zIndex: 1,
    '& > p': { whiteSpace: 'pre' },
  },
  legend: {
    position: 'absolute',
    bottom: '50%',
    maxWidth: 250,
    transform: 'translateY(50%)',
  },
}));

const COORD = {
  YT: { top: '10%', left: '5%' },
  SK: { top: '55%', left: '25%' },
  QC: { top: '8%', left: '55%' },
  PE: { top: '60%', left: '88%' },
  ON: { top: '55%', left: '45%' },
  NU: { top: '15%', left: '30%' },
  NT: { top: '8%', left: '18%' },
  NS: { top: '75%', left: '85%' },
  NL: { top: '33%', left: '85%' },
  NB: { top: '50%', left: '70%' },
  MB: { top: '30%', left: '35%' },
  BC: { top: '65%', left: '8%' },
  AB: { top: '25%', left: '8%' },

  BIO: { top: '30%', left: '55%' },
  RENEWABLE: { top: '65%', left: '60%' },
  GAS: { top: '15%', left: '70%' },
  HYDRO: { top: '40%', left: '15%' },
  NUCLEAR: { top: '8%', left: '30%' },
  OIL: { top: '20%', left: '10%' },
  COAL: { top: '45%', left: '75%' },
};

const Electricity = ({ data, year }) => {
  const classes = useStyles();

  const intl = useIntl();
  const {
    sources: { electricity: { colors: colorSources } },
    regions: { colors: colorRegions },
  } = useAPI();
  const { config } = useConfig();

  const iteration = useMemo(() => parseInt(config.yearId, 10), [config.yearId]);

  /**
   * CER template uses a custom breakpoint.
   */
  const desktop = useMediaQuery('(min-width: 992px)');

  const [currYear, setCurrYear] = useState(config.baseYear || iteration);

  useEffect(() => setCurrYear(config.baseYear || year?.min), [config.baseYear, year]);

  /**
   * Coefficients for determining bubble sizes during the calculation.
   */
  const BUBBLE_SIZE = useMemo(() => ({
    region: { MAX: desktop ? 20 : 10, MIN: 0.5 },
    source: { MAX: desktop ? 30 : 15, MIN: 0 },
    single: desktop ? 20 : 10,
  }), [desktop]);

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
  const sizeMin = useMemo(() => BUBBLE_SIZE[config.view]?.MIN, [config.view, BUBBLE_SIZE]);
  const sizeMax = useMemo(
    () => (single ? BUBBLE_SIZE.single : BUBBLE_SIZE[config.view]?.MAX),
    [config.view, single, BUBBLE_SIZE],
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
    const dataWithPosition = totals ? Object.keys(data[currYear]).map((entry) => {
      const size = getSize(totals[entry]);
      return {
        name: entry, // entry can be 'region' or 'source' depending on the view selection
        size,
        value: totals[entry],
        nodes: data[currYear][entry].sort((a, b) => b.value - a.value).map(node => ({
          ...node,
          size: getSize(node.value),
          color: { ...colorSources, ...colorRegions }[node.name],
          translation: intl.formatMessage({
            id: `${config.view === 'source' ? 'common.regions' : 'common.sources.electricity'}.${node.name}`,
          }),
        })),
        style: {
          height: size * 8,
          width: size * 8,
          top: single ? 'calc(50% - 120px)' : COORD[entry].top,
          left: single ? 'calc(50% - 200px)' : COORD[entry].left,
        },
      };
    }) : [];
    return dataWithPosition;
  }, [data, config.view, intl, colorSources, colorRegions, currYear, getSize, single, totals]);

  /**
   * Capture hover event but don't send repeated records.
   */
  const prevEvent = useRef(null);
  const handleEventUpdate = useCallback((entry) => {
    const event = `${entry.name} - ${config.baseYear || year?.min}`;
    if (event !== prevEvent.current) {
      analytics.reportPoi(config.page, event);
      prevEvent.current = event;
    }
  }, [year, config.baseYear, config.page, prevEvent]);

  if (!data || !processedData || processedData.length <= 0) {
    return null;
  }

  return (
    <div className={classes.root}>
      {/* current year number at the top-right corner */}
      <Typography variant="h5" color="primary" className={classes.year}>{currYear}</Typography>

      {/* bubble annotation below the year number */}
      <Grid container className={classes.annotation}>
        <Grid item xs={12}>
          <div className={classes.annotationCircle} />
          <div className={classes.annotationCircle} />
        </Grid>
        <Grid item xs={6}>
          {config.view === 'region' && <Typography variant="caption">{intl.formatMessage({ id: 'common.electricity.amount.bySource' })}</Typography>}
          {config.view === 'source' && <Typography variant="caption">{intl.formatMessage({ id: 'common.electricity.amount.byRegion' })}</Typography>}
        </Grid>
        <Grid item xs={6}><Typography variant="caption">{intl.formatMessage({ id: 'common.electricity.amount.total' })}</Typography></Grid>
      </Grid>

      {processedData.map(entry => (
        <Tooltip
          key={`bubble-${entry.name}`}
          title={single ? '' : <VizTooltip nodes={entry.nodes} unit={config.unit} />}
          onOpen={() => handleEventUpdate(entry)}
          classes={{ tooltip: classes.tooltip }}
        >
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
              <Typography variant="body2">
                {config.view === 'source' ? intl.formatMessage({ id: `common.sources.electricity.${entry.name}` }) : entry.name}
              </Typography>
            </Paper>

            {/* static legend shown beside a single province */}
            {single && (
              <div className={classes.legend} style={{ right: `calc(-100% - ${desktop ? 100 : 200}px)` }}>
                <VizTooltip nodes={entry.nodes} unit={config.unit} />
              </div>
            )}
          </div>
        </Tooltip>
      ))}

      {/* below are the controls for the year playback */}
      <YearSlider
        year={currYear}
        onYearChange={value => setCurrYear(value)}
        min={year.min}
        max={year.max}
        forecast={year.forecastStart}
      />
    </div>
  );
};

Electricity.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  year: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
    forecastStart: PropTypes.number,
  }),
};

Electricity.defaultProps = {
  data: undefined,
  year: undefined,
};

export default Electricity;
