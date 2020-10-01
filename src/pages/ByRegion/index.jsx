import React, { useEffect, useMemo, useCallback } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import ForecastBar from '../../components/ForecastBar';
import convertHexToRGB from '../../utilities/convertHexToRGB';

const ByRegion = ({ data, year }) => {
  const { regions } = useAPI();
  const { config, setConfig } = useConfig();

  const customColorProp = useCallback((maxYear, forecastYear, hexFunc) => (d) => {
    const opacityNumber = (d.indexValue > forecastYear)
      ? (1.5 - ((d.indexValue - forecastYear) / (maxYear - forecastYear)))
      : 1;
    return hexFunc(regions.colors[d.id], opacityNumber);
  }, [regions.colors]);

  const colors = customColorProp(year.max, year.forecastStart, convertHexToRGB);

  /**
   * A "hacky" but sufficient way to reselect all regions after
   * being redirected from other pages but none of the regions is currently selected.
   */
  useEffect(() => {
    if (config.page === 'by-region' && JSON.stringify(config.provinces || []) === '["ALL"]') {
      setConfig({ ...config, provinces: regions.order });
    }
  }, [config, setConfig, regions.order]);

  /**
   * Determine the region order shown in the stacked bar chart.
   */
  const keys = useMemo(() => [...config.provinceOrder].reverse(), [config.provinceOrder]);

  if (!data) {
    return null;
  }

  return (
    <>
      {/* Its worth considering whether or not the forecast bar can be a Nivo layer */}
      <ForecastBar year={year} />
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy="year"
        margin={{ top: 50, right: 80, bottom: 50, left: 50 }}
        padding={0.1}
        colors={colors}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
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
  year: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
    forecastStart: PropTypes.number,
  }),

};

ByRegion.defaultProps = {
  data: undefined,
  year: {
    min: 0,
    max: 0,
    forecastStart: 0,
  },
};

export default ByRegion;
