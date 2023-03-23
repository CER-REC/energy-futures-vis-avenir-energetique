import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

const MaxTick = ({ value, unit }) => (
  <tspan style={{ fontWeight: 700 }}>
    <tspan x="0" y="-12" textAnchor="start" style={{ fontSize: 14 }}>{value}</tspan>
    <tspan x="0" y="-28" textAnchor="start" style={{ fontSize: 10 }}>{useIntl().formatMessage({ id: `common.units.${unit}` }) || unit}</tspan>
  </tspan>
);

MaxTick.propTypes = {
  value: PropTypes.number.isRequired,
  unit: PropTypes.string,
};

MaxTick.defaultProps = {
  unit: '',
};

export default MaxTick;
