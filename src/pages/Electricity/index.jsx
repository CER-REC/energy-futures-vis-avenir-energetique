import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Paper, Grid, Typography, Button, Slider } from '@material-ui/core';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import PauseIcon from '@material-ui/icons/PauseCircleOutline';
import { ResponsiveBubble } from '@nivo/circle-packing';
import { useIntl } from 'react-intl';

import { UNIT_NAMES } from '../../constants';
import { formatUnitAbbreviation } from '../../utilities/convertUnit';
import useAPI from '../../hooks/useAPI';

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

const REGION_LOC = {
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
};
const BUBBLE_SIZE_MIN = 1;
const BUBBLE_SIZE_MAX = 20;

/**
 * Rendering bubble tooltips.
 */
const Tooltip = ({ name, value, unit }) => (
  <Typography style={{ whiteSpace: 'nowrap' }}>
    {name}: {formatUnitAbbreviation(value)} {UNIT_NAMES[unit]}
  </Typography>
);

Tooltip.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
};

/**
 * Rendering each bubble chart for a single province.
 */
const Bubble = ({ province, data, unit, colors }) => {
  const intl = useIntl();
  const getColor = useCallback(dataItem => colors[dataItem.name] || '#FFFFFF', [colors]);
  const getBorderColor = useCallback(
    chartItem => (chartItem.color === 'rgb(255,255,255)' ? '#666666' : chartItem.color),
    [],
  );
  const getTooltip = useCallback(
    (dataItem) => {
      // TODO: Add application translation for TOTAL
      let name = 'TOTAL';

      if (dataItem.id !== province) {
        name = intl.formatMessage({ id: `common.sources.electricity.${dataItem.data.name}` }).toUpperCase();
      }

      return <Tooltip name={name} value={dataItem.value} unit={unit} />;
    },
    [province, intl, unit],
  );

  return (
    <ResponsiveBubble
      root={{ name: province, children: data }}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      identity="name"
      value="value"
      colors={getColor}
      padding={2}
      borderWidth={1}
      borderColor={getBorderColor}
      enableLabel={false}
      tooltip={getTooltip}
      isZoomable={false}
      animate
      motionStiffness={90}
      motionDamping={12}
    />
  );
};

Bubble.propTypes = {
  province: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  unit: PropTypes.string,
  colors: PropTypes.shape({}),
};

Bubble.defaultProps = {
  province: '',
  data: undefined,
  unit: '',
  colors: {},
};

const Electricity = ({ data, year }) => {
  const classes = useStyles();

  const { sources: { electricity: { colors } } } = useAPI();

  const [currYear, setCurrYear] = useState(year?.min || 0);
  const [play, setPlay] = useState(false);

  useEffect(() => setCurrYear(year?.min || 0), [year]);

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
   * Post-process for determining bubble sizes and positions.
   */
  const { totals, max, min } = useMemo(() => {
    if (!data || !data[currYear]) {
      return { totals, max: Number.POSITIVE_INFINITY, min: Number.NEGATIVE_INFINITY };
    }

    const totals = Object.keys(data[currYear]).reduce((result, province) => ({
      ...result,
      [province]: Object.values(data[currYear][province])
        .map(entry => entry.value)
        .reduce((a, b) => a + b),
    }), {});

    return {
      totals,
      max: Math.max(...Object.values(totals)),
      min: Math.min(...Object.values(totals)),
    }
  }, [data, currYear]);

  const getSize = useCallback(
    value => Math.sqrt(value / (max - min)) * BUBBLE_SIZE_MAX + BUBBLE_SIZE_MIN,
    [max, min],
  );

  const isSingle = useMemo(() => Math.abs(max - min) < Number.EPSILON, [max, min]);

  const processedData = useMemo(() => {
    const dataWithPosition = totals ? Object.keys(data[currYear]).map(province => {
      const size = isSingle ? Number.POSITIVE_INFINITY : getSize(totals[province]);
      return {
        name: province,
        size,
        height: isSingle ? '80%' : size * 8,
        width: isSingle ? '80%' : size * 8,
        top: isSingle ? '10%' : REGION_LOC[province].top,
        left: isSingle ? '10%' : REGION_LOC[province].left,
        nodes: data[currYear][province].sort((a, b) => b.value - a.value).map(source => ({
          ...source,
          size: getSize(source.value),
        })),
      }
    }) : [];
    return dataWithPosition;
  }, [data, max, min]);

  if (!data || !processedData || processedData.length <= 0) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Typography variant="h3" color="primary" className={classes.year}>{`${currYear} `}</Typography>

      {processedData.map(entry => (
        <div
          key={`bubble-${entry.name}`}
          className={classes.region}
          style={{ height: entry.height, width: entry.width, top: entry.top, left: entry.left }}
        >
          {entry.nodes.map((source, index) => {
            const theta = index === 0 ? 0 : Array(index + 1)
              .fill(undefined)
              .reduce((sum, _, i) => sum + ((i === 0 || i === index) ? 1 : 2) * (entry.nodes[i].size / entry.size * 1.1), 0);
            const x = isNaN(theta) ? 0 : entry.size * 4 * (1 - Math.cos(theta));
            const y = isNaN(theta) ? 0 : entry.size * 4 * Math.sin(theta);
            return (
              <div
                key={`region-${entry.name}-source-${source.name}`}
                className={classes.subregion}
                style={{
                  top: entry.size * 4 + y,
                  left: x,
                  height: source.size * 8,
                  width: source.size * 8,
                  backgroundColor: colors[source.name],
                }}
              />
            );
          })}
          {/* <div style={{ height: '100%', width: '100%', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, .4)' }} /> */}
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
