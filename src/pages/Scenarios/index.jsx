import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import { SCENARIO_COLOR } from '../../constants';

const Scenarios = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <ResponsiveLine
      data={data}
      curve="cardinal"
      areaOpacity={0.15}
      enableArea
      margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', min: 0, max: 'auto', stacked: true, reverse: false }}
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
        format: year => ((year % 5) ? '' : year),
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
  );
};

Scenarios.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
};

Scenarios.defaultProps = {
  data: undefined,
};

export default Scenarios;
