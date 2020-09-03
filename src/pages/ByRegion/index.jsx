import React, { useEffect, useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';

import { REGIONS, REGION_ORDER } from '../../types';
import useConfig from '../../hooks/useConfig';

const ByRegion = ({ data }) => {
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

  return (
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
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      animate
      motionStiffness={90}
      motionDamping={15}
    />
  );
};

ByRegion.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
};

ByRegion.defaultProps = {
  data: undefined,
};

export default ByRegion;
