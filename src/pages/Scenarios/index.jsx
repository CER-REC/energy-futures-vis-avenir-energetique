import React, { useCallback } from 'react';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import { SCENARIO_COLOR } from '../../constants';
import ForecastBar from '../../components/ForecastBar';
import useConfig from '../../hooks/useConfig';

const Scenarios = ({ data, year }) => {
  const { yearId } = useConfig().config;

  const backgroundLayer = yearProp => (args) => {
    // This number is used in multiple charts. Perhaps it should be passed as a prop.
    const preForecastPercentage = ((2020 - yearProp.min) / (yearProp.max - yearProp.min)) * 100;

    /*
    Generate the areas for lines in the chart.
    The slice and reverse part is taken directly from the way Nivo draws the areas,
    removing them affects the look of the chart, though I dont know why.
    */
    const areas = args.series
      .slice(0)
      .reverse()
      .map((line, index) => (
        <g key={line.id}>
          <defs>
            <linearGradient id={`line-${index}-gradient`}>
              {/* Gradient starts to fade after forecast line */}
              <stop offset={`${preForecastPercentage}%`} stopColor={line.color} stopOpacity='1' />
              <stop offset={`${100 - preForecastPercentage}%`} stopColor={line.color} stopOpacity='0.6' />
              <stop offset='95%' stopColor={line.color} stopOpacity='0.2' />
            </linearGradient>
          </defs>
          <path
            d={args.areaGenerator(line.data.map(d => d.position))}
            fill={`url(#line-${index}-gradient)`}
            style={{ mixBlendMode: 'multiply', pointerEvents: 'none' }}
            opacity={0.5}
          />
        </g>
      ));

    return (<>{areas}</>);
  };

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
        layers={['grid', pointsLayer(yearId), 'axes', 'areas', 'crosshair', 'lines', 'points', 'mesh', backgroundLayer(year)]}
        data={data}
        curve="cardinal"
        // areaOpacity={0.15}
        // enableArea
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
