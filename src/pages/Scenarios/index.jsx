import React, { useCallback, useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';

import useConfig from '../../hooks/useConfig';
import { CHART_PROPS, CHART_AXIS_PROPS, SCENARIO_COLOR, UNIT_NAMES } from '../../constants';
import ForecastBar from '../../components/ForecastBar';

const Scenarios = ({ data, year }) => {
  const { config } = useConfig();

  /**
   * Generate a custom dotted line layer for rendering the default scenario.
   */
  const dottedLayer = useCallback(scenarioYear => args => args.points
    .filter(point => point.serieId === (scenarioYear === '2020' ? 'Evolving' : 'Reference'))
    .map(point => (
      <circle
        key={point.id}
        cx={point.x}
        cy={point.y}
        r={args.pointSize / 2}
        fill={point.color}
        stroke={point.borderColor}
        strokeWidth={args.pointBorderWidth}
        style={{ pointerEvents: 'none' }}
      />
    )), []);
  const dots = useMemo(() => dottedLayer(config.yearId), [config.yearId, dottedLayer]);

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

  if (!data) {
    return null;
  }

  return (
    <>
      <ForecastBar year={year} />
      <ResponsiveLine
        {...CHART_PROPS}
        data={data}
        enableArea
        enablePoints={false}
        layers={['grid', 'axes', 'areas', 'crosshair', 'lines', 'points', 'mesh', dots]}
        curve="cardinal"
        areaOpacity={0.15}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: 'auto', reverse: false }}
        colors={d => SCENARIO_COLOR[d.id] || '#AAA'}
        pointSize={8}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="y"
        pointLabelYOffset={-12}
        axisBottom={{
          ...CHART_AXIS_PROPS,
          format: yearLabel => ((yearLabel % 5) ? '' : yearLabel),
        }}
        axisRight={{
          ...CHART_AXIS_PROPS,
          format: getFormattedTick,
        }}
        useMesh
      />
    </>
  );
};

Scenarios.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  year: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number }),
};

Scenarios.defaultProps = {
  data: undefined,
  year: { min: 0, max: 0 },
};

export default Scenarios;
