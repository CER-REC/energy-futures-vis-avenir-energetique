import React from 'react';
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

const ForecastLayer = ({
  height,
  innerHeight,
  innerWidth,
  width,
  margin,
  maxYear,
  minYear,
  forecastStart,
  forecastLabel,
}) => {
  const classes = useStyles();

  if (!maxYear || !minYear || !forecastStart) {
    return null;
  }

  const forecastPercentage = (forecastStart - minYear) / (maxYear - minYear);
  const lineHeight = innerHeight || height;
  const forecastWidth = innerWidth || (width - 30);
  const x = forecastPercentage * forecastWidth + (innerWidth ? 0 : 15);
  const y = margin?.top || 50;

  return (
    <g>
      <defs>
        <linearGradient id="forecastBarGradient">
          <stop offset="0%" stopColor="#EEE" stopOpacity="1" />
          <stop offset="30%" stopColor="#EEE" stopOpacity="1" />
          <stop offset="100%" stopColor="#EEE" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect
        x={x}
        y={-y}
        height={20}
        width={forecastWidth - x}
        fill="url(#forecastBarGradient)"
      />
      <text className={classes.label} x={x + 5} y={-y + 14}>
        {forecastLabel}
      </text>
      <path
        d={`M${x} ${-y} l0 ${lineHeight + y}`}
        strokeDasharray="5,5"
        stroke="#444"
        strokeWidth="1"
      />
    </g>
  );
};

ForecastLayer.propTypes = {
  innerHeight: PropTypes.number,
  innerWidth: PropTypes.number,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  margin: PropTypes.shape({ top: PropTypes.number.isRequired }).isRequired,
  maxYear: PropTypes.number,
  minYear: PropTypes.number,
  forecastStart: PropTypes.number,
  forecastLabel: PropTypes.number,
};

ForecastLayer.defaultProps = {
  innerHeight: null,
  innerWidth: null,
  maxYear: null,
  minYear: null,
  forecastStart: null,
  forecastLabel: null,
};

export default ForecastLayer;
