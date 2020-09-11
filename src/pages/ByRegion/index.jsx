import React, { useEffect, useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';

import { REGIONS, REGION_ORDER } from '../../types';
import useConfig from '../../hooks/useConfig';

const ByRegion = ({ data, year }) => {
  const { config, setConfig } = useConfig();

  /**
   * A "hacky" but sufficient way to reselect all regions after
   * being redirected from other pages but none of the regions is currently selected.
   */
  useEffect(() => {
    if (config.page === 'by-region' && JSON.stringify(config.provinces || []) === '["ALL"]') {
      setConfig({ ...config, provinces: REGION_ORDER });
    }
  }, [config, setConfig]);

  /**
   * Determine the region order shown in the stacked bar chart.
   */
  const keys = useMemo(() => [...config.provinceOrder].reverse(), [config.provinceOrder]);

  if (!data) {
    return null;
  }
  const forecastYear = 2020;

  const width = ((year.max - forecastYear) / (year.max - year.min)) * 100;
  const margin = ((forecastYear - year.min) / (year.max - year.min)) * 100;

  return (
    <>
      <div style={{
        // 130 is to offset the chart margin, and 16 is for the small gap on either side.
        width: 'calc(100% - 130px)',
        marginLeft: (50),
        position: 'relative',
        borderTop: '3px solid red',

      }}
      >
        <div
          style={{
            marginLeft: `${margin}%`,
            width: `${width}%`,
            borderLeft: '2px dashed lightgray',
            height: '624px',
            top: 10,
            position: 'absolute',
          }}
        >
          <div style={{ backgroundColor: 'lightgrey' }}>Forecast</div>
        </div>
      </div>
      {/* <div style={{ width: 'calc(100% - 100px - 16px)', marginLeft: (50 + 8) }}>
        <div style={{
          display: 'inline-block',
          width: '40%',
          height: 20,
        }}
        />
      </div> */}
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy="year"
        margin={{ top: 50, right: 80, bottom: 50, left: 50 }}
        padding={0.1}
        colors={d => REGIONS[d.id].color[600]}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisLeft={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: 32,
          format: years => ((years % 5) ? '' : years),
        }}
        axisRight={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        enableLabel={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        animate
        motionStiffness={90}
        motionDamping={15}
      />
    </>
  );
};

ByRegion.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  year: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number }),

};

ByRegion.defaultProps = {
  data: undefined,
  year: { min: 0, max: 0 },
};

export default ByRegion;
