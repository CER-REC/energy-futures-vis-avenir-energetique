import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import data from './data';
import PageLayout from '../../components/PageLayout';


const Scenarios = () => {
  if (!data) {
    return null;
  }

  return (
    <PageLayout showRegion>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 50, bottom: 50, left: 80 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: 'auto', stacked: true, reverse: false }}
        colors={{ scheme: 'nivo' }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="y"
        pointLabelYOffset={-12}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: 32,
          format: year => (year % 5) ? '' : year,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        enableLabel={false}
        // labelSkipWidth={12}
        // labelSkipHeight={12}
        // labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        useMesh={true}
      />
    </PageLayout>
  );
};

export default Scenarios;
