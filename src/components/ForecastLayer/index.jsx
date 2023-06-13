import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import getYearX from '../../utilities/getYearX';

const useStyles = makeStyles(theme => ({
  label: {
    ...theme.mixins.zoneLabel,
  },
}));

const ForecastLayer = ({
  bars,
  width,
  height,
  innerHeight,
  innerWidth,
  margin,
  padding,
  xScale,
  forecastStart,
  hasCenteredProjectionLine = false,
}) => {
  const intl = useIntl();
  const classes = useStyles();
  const x = useMemo(
    () => getYearX(forecastStart, xScale, bars, padding, hasCenteredProjectionLine),
    [forecastStart, xScale, bars, padding, hasCenteredProjectionLine],
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
        {intl.formatMessage({ id: 'common.forecast' })}
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
  padding: PropTypes.number.isRequired,
  /** The function to get the x coordinate of the index (provided by nivo) */
  xScale: PropTypes.func.isRequired,
  /** The year the forecast starts (set in nivo component) */
  forecastStart: PropTypes.number,
  hasCenteredProjectionLine: PropTypes.bool,
};

ForecastLayer.defaultProps = {
  bars: null,
  innerHeight: null,
  innerWidth: null,
  forecastStart: null,
  hasCenteredProjectionLine: false,
};

export default ForecastLayer;
