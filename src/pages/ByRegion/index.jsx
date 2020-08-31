import React, { useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';

import useConfig from '../../hooks/useConfig';
import { REGION_ORDER } from '../../types';

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

  if (!data) {
    return null;
  }

  return (
    <ResponsiveBar
      data={data}
      keys={config.provinces}
      indexBy="year"
      margin={{ top: 50, right: 0, bottom: 50, left: 80 }}
      padding={0.1}
      colors={{ scheme: 'nivo' }}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: 'middle',
        legendOffset: 32,
        format: year => ((year % 5) ? '' : year),
      }}
      axisLeft={{
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
