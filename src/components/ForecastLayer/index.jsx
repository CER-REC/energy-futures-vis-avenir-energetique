import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  label: {
    fill: theme.palette.secondary.main,
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    textTransform: 'uppercase',
  },
}));

const getYearX = (year, xScale, bars) => {
  let x = xScale(year);

  if (bars) {
    const widths = bars
      .filter(bar => bar.data.indexValue === year.toString())
      .map(bar => bar.width);
    const maxWidth = Math.max(...widths);

    // xScale returns the starting x for bars
    x += Math.round(maxWidth / 2);
  }

  return x;
};

const ForecastLayer = ({
  bars,
  height,
  innerHeight,
  innerWidth,
  margin,
  xScale,
  forecastStart,
  forecastLabel,
}) => {
  const classes = useStyles();
  const x = useMemo(
    () => getYearX(forecastStart, xScale, bars),
    [forecastStart, xScale, bars],
  );
  const y = -margin.top;
  const lineHeight = (innerHeight || height) + margin.top;
  const forecastWidth = useMemo(() => {
    if (!bars) {
      return innerWidth - x;
    }

    const years = bars.map(bar => bar.data.indexValue);
    const maxYear = Math.max(...years);

    return getYearX(maxYear, xScale, bars) - x;
  }, [bars, innerWidth, xScale, x]);

  if (!forecastStart) {
    return null;
  }

  return (
    <g transform={`translate(${x}, ${y})`}>
      <defs>
        <linearGradient id="forecastBarGradient">
          <stop offset="0%" stopColor="#EEE" stopOpacity="1" />
          <stop offset="30%" stopColor="#EEE" stopOpacity="1" />
          <stop offset="100%" stopColor="#EEE" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect
        height={20}
        width={forecastWidth}
        fill="url(#forecastBarGradient)"
      />
      <text className={classes.label} x={5} y={14}>
        {forecastLabel}
      </text>
      <path
        d={`M0 0 L0 ${lineHeight}`}
        strokeDasharray="5,5"
        stroke="#444"
        strokeWidth="1"
      />
    </g>
  );
};

ForecastLayer.propTypes = {
  bars: PropTypes.arrayOf(PropTypes.shape({
    data: PropTypes.shape({ indexValue: PropTypes.string.isRequired }),
    width: PropTypes.number.isRequired,
  })),
  height: PropTypes.number.isRequired,
  innerHeight: PropTypes.number,
  innerWidth: PropTypes.number,
  margin: PropTypes.shape({ top: PropTypes.number.isRequired }).isRequired,
  xScale: PropTypes.func.isRequired,
  forecastStart: PropTypes.number,
  forecastLabel: PropTypes.string,
};

ForecastLayer.defaultProps = {
  bars: null,
  innerHeight: null,
  innerWidth: null,
  forecastStart: null,
  forecastLabel: null,
};

export default ForecastLayer;
