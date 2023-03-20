import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import getYearX from '../../utilities/getYearX';

const useStyles = makeStyles(theme => ({
  label: {
    ...theme.mixins.zoneLabel,
  },
}));

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
  /** The bar data (provided by nivo) */
  bars: PropTypes.arrayOf(PropTypes.shape({
    data: PropTypes.shape({ indexValue: PropTypes.string.isRequired }),
    width: PropTypes.number.isRequired,
  })),
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
