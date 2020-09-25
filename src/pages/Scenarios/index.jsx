import React, { useCallback } from 'react';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import { SCENARIO_COLOR } from '../../constants';
import ForecastBar from '../../components/ForecastBar';
import fadeLayer from '../../components/FadeLayer/index';
import useConfig from '../../hooks/useConfig';

const Scenarios = ({ data, year }) => {
  const { yearId } = useConfig().config;

  const pointsLayer = useCallback(scenarioYear => args => args.points
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

  if (!data) {
    return null;
  }

  return (
    <>
      <ForecastBar year={year} />
      <ResponsiveLine
        enablePoints={false}
        layers={['grid', pointsLayer(yearId), 'axes', 'areas', 'crosshair', 'lines', 'points', 'mesh', fadeLayer(year)]}
        data={data}
        curve="cardinal"
        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: 'auto', reverse: false }}
        colors={d => SCENARIO_COLOR[d.id] || '#AAA'}
        pointSize={8}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="y"
        pointLabelYOffset={-12}
        axisTop={null}
        axisLeft={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: 32,
          format: yearLabel => ((yearLabel % 5) ? '' : yearLabel),
        }}
        axisRight={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        enableLabel={false}
        animate
        motionStiffness={90}
        motionDamping={15}
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
