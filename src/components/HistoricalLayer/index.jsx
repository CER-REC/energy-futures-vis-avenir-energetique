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
  margin,
  xScale,
  forecastStart,
}) => {
  const intl = useIntl();
  const classes = useStyles();

  const historicalWidth = useMemo(
    () => getYearX(forecastStart, xScale) + margin.left,
    [forecastStart, xScale, margin.left],
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
  margin: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }).isRequired,
  /** The function to get the x coordinate of the index (provided by nivo) */
  xScale: PropTypes.func.isRequired,
  /** The year the forecast starts (set in nivo component) */
  forecastStart: PropTypes.number,
};

HistoricalLayer.defaultProps = {
  forecastStart: null,
};

export default HistoricalLayer;
