import React, { useEffect, useMemo, useCallback } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import { CHART_PROPS, CHART_AXIS_PROPS, UNIT_NAMES } from '../../constants';
import ForecastBar from '../../components/ForecastBar';
import convertHexToRGB from '../../utilities/convertHexToRGB';

const ByRegion = ({ data, year }) => {
  const { regions } = useAPI();
  const { config, setConfig } = useConfig();

  /**
   * Manually calculating bar colors to create the fade-out effect.
   */
  const customColorProp = useCallback((maxYear, forecastYear, hexFunc) => (d) => {
    const opacityNumber = (d.indexValue > forecastYear)
      ? (1.5 - ((d.indexValue - forecastYear) / (maxYear - forecastYear)))
      : 1;
    return hexFunc(regions.colors[d.id], opacityNumber);
  }, [regions.colors]);

  // FIXME: this is a hardcoded solution
  const forecastYear = 2020;

  const colors = customColorProp(year.max, forecastYear, convertHexToRGB);

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
      {/* Its worth considering whether or not the forecast bar can be a Nivo layer */}
      <ForecastBar year={year} />
      <ResponsiveBar
        {...CHART_PROPS}
        data={data}
        keys={keys}
        indexBy="year"
        padding={0.1}
        colors={colors}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisBottom={{
          ...CHART_AXIS_PROPS,
          format: yearLabel => ((yearLabel % 5) ? '' : yearLabel),
        }}
        axisRight={{
          ...CHART_AXIS_PROPS,
          format: getFormattedTick,
        }}
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
