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

const HistoricalLayer = ({
  bars,
  height,
  innerHeight,
  margin,
  xScale,
  forecastStart,
}) => {
  const intl = useIntl();
  const classes = useStyles();
  const historicalWidth = useMemo(
    () => getYearX(forecastStart, xScale, bars),
    [forecastStart, xScale, bars],
  );
  const y = -margin.top;
  const lineHeight = (innerHeight || height) + margin.top;

  if (!forecastStart) {
    return null;
  }

  return (
    <g transform={`translate(0, ${y})`}>
      <rect
        height={lineHeight}
        width={historicalWidth}
        fill="#E6E6E8"
      />
      <rect
        height={20}
        width={historicalWidth}
        fill="#DEDEE1"
      />
      <text className={classes.label} x={5} y={14}>
        {intl.formatMessage({ id: 'components.historicalLayer.historical' })}
      </text>
    </g>
  );
};

HistoricalLayer.propTypes = {
  /** The bar data (provided by nivo) */
  bars: PropTypes.arrayOf(PropTypes.shape({
    data: PropTypes.shape({ indexValue: PropTypes.string.isRequired }),
    width: PropTypes.number.isRequired,
  })),
  /** The height of the bar chart (provided by nivo) */
  height: PropTypes.number.isRequired,
  /** The height of the line chart (provided by nivo) */
  innerHeight: PropTypes.number,
  /** The margins of the chart (provided by nivo) */
  margin: PropTypes.shape({
    top: PropTypes.number.isRequired,
  }).isRequired,
  /** The function to get the x coordinate of the index (provided by nivo) */
  xScale: PropTypes.func.isRequired,
  /** The year the forecast starts (set in nivo component) */
  forecastStart: PropTypes.number,
};

HistoricalLayer.defaultProps = {
  bars: null,
  innerHeight: null,
  forecastStart: null,
};

export default HistoricalLayer;
