import React, { useCallback, useMemo } from 'react';
import { ResponsiveStream } from '@nivo/stream';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import ForecastBar from '../../components/ForecastBar';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import { UNIT_NAMES } from '../../constants';

const BySector = ({ data, year }) => {
  const intl = useIntl();
  const { sources: { energy: { colors } } } = useAPI();
  const { config } = useConfig();

  const keys = useMemo(() => {
    const sources = new Set((data || []).map(entry => Object.keys(entry)).flat());
    return [...config.sourceOrder].reverse().filter(s => sources.has(s));
  }, [data, config.sourceOrder]);

  /**
   * Format y-axis ticks so that unit is shown beside the largest value.
   */
  const getFormattedTick = useCallback(value => (
    <>
      <tspan className="tickValue">{value}</tspan>
      <tspan className="tickUnit">
        <tspan x="0" y="-8">{value}</tspan>
        <tspan x="0" y="8">{UNIT_NAMES[config.unit] || config.unit}</tspan>
      </tspan>
    </>
  ), [config.unit]);

  /**
   * Format tooltip labels.
   */
  const getTooltipLabel = useCallback(
    dataItem => intl.formatMessage({ id: `common.sources.energy.${dataItem.id}` }).toUpperCase(),
    [intl],
  );

  if (!data || !year) {
    return null;
  }

  return (
    <>
      <ForecastBar year={year} />
      <ResponsiveStream
        data={data}
        keys={keys}
        margin={{ top: 50, right: 80, bottom: 50, left: 50 }}
        axisTop={null}
        axisRight={{
          orient: 'right',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: getFormattedTick,
        }}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: value => ((value % 5) ? '' : value + year.min),
        }}
        axisLeft={null}
        curve="linear"
        offsetType="diverging"
        colors={d => colors[keys[d.index]]}
        fillOpacity={0.60}
        borderColor={{ theme: 'background' }}
        dotSize={8}
        dotColor={{ from: 'color' }}
        dotBorderWidth={2}
        dotBorderColor={{ from: 'color', modifiers: [['darker', 0.7]] }}
        animate
        motionStiffness={90}
        motionDamping={15}
        tooltipLabel={getTooltipLabel}
      />
    </>
  );
};

BySector.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  year: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number }),
};

BySector.defaultProps = {
  data: undefined,
  year: { min: 0, max: 0 },
};

export default BySector;
