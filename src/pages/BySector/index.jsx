import React, { useCallback, useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import ForecastBar from '../../components/ForecastBar';
import fadeLayer from '../../components/FadeLayer';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import { CHART_PROPS, CHART_AXIS_PROPS, UNIT_NAMES } from '../../constants';

const BySector = ({ data, year }) => {
  const intl = useIntl();
  const { sources: { energy: { colors } } } = useAPI();
  const { config } = useConfig();

  const keys = useMemo(() => {
    const sources = new Set((data || []).map(entry => Object.keys(entry)).flat());
    return [...config.sourceOrder].reverse().filter(s => sources.has(s));
  }, [data, config.sourceOrder]);

  /**
   * The fade-out effect over forecast years.
   */
  const fade = useMemo(() => fadeLayer(year), [year]);

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
      <ResponsiveLine
        {...CHART_PROPS}
        data={data}
        keys={keys}
        layers={['grid', 'axes', 'areas', 'crosshair', 'lines', 'points', 'mesh', fade]}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: 'auto', stacked: true, reverse: false }}
        curve="cardinal"
        axisRight={{
          ...CHART_AXIS_PROPS,
          format: getFormattedTick,
        }}
        axisBottom={{
          ...CHART_AXIS_PROPS,
          format: value => ((value % 5) ? '' : value + year.min),
        }}
        colors={d => colors[d.id]}
        lineWidth={0}
        enablePoints={false}
        areaBaselineValue={0}
        tooltipLabel={getTooltipLabel}
        useMesh
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
