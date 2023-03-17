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
  width,
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
  const forecastWidth = useMemo(
    () => (bars ? width - x : innerWidth - x),
    [bars, innerWidth, width, x],
  );

  if (!forecastStart) {
    return null;
  }

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        height={20}
        width={forecastWidth}
        fill="#EEE"
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
  /** The bar data (provided by nivo) */
  bars: PropTypes.arrayOf(PropTypes.shape({
    data: PropTypes.shape({ indexValue: PropTypes.string.isRequired }),
    width: PropTypes.number.isRequired,
  })),
  /** The width of the bar chart (provided by nivo) */
  width: PropTypes.number.isRequired,
  /** The height of the bar chart (provided by nivo) */
  height: PropTypes.number.isRequired,
  /** The height of the line chart (provided by nivo) */
  innerHeight: PropTypes.number,
  /** The width of the line chart (provided by nivo) */
  innerWidth: PropTypes.number,
  /** The margins of the chart (provided by nivo) */
  margin: PropTypes.shape({ top: PropTypes.number.isRequired }).isRequired,
  /** The function to get the x coordinate of the index (provided by nivo) */
  xScale: PropTypes.func.isRequired,
  /** The year the forecast starts (set in nivo component) */
  forecastStart: PropTypes.number,
  /** The text to display by the forecast line (set in nivo component) */
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
