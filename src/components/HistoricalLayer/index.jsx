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
  margin,
  padding,
  xScale,
  forecastStart,
}) => {
  const intl = useIntl();
  const classes = useStyles();

  const historicalWidth = useMemo(
    () => getYearX(forecastStart, xScale, bars, padding) + margin.left,
    [forecastStart, xScale, bars, padding, margin.left],
  );
  const y = -margin.top;

  if (!forecastStart) {
    return null;
  }

  return (
    <g transform={`translate(${-margin.left}, ${y})`}>
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
  margin: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }).isRequired,
  padding: PropTypes.number.isRequired,
  /** The function to get the x coordinate of the index (provided by nivo) */
  xScale: PropTypes.func.isRequired,
  /** The year the forecast starts (set in nivo component) */
  forecastStart: PropTypes.number,
};

HistoricalLayer.defaultProps = {
  bars: null,
  forecastStart: null,
};

export default HistoricalLayer;
