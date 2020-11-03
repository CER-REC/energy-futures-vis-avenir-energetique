import React, { useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import { CHART_PROPS, CHART_AXIS_PROPS } from '../../constants';
import { formatUnitAbbreviation } from '../../utilities/convertUnit';
import { getMaxTick } from '../../utilities/parseData';
import convertHexToRGB from '../../utilities/convertHexToRGB';
import forecastLayer from '../../components/ForecastLayer';
import MaxTick from '../../components/MaxTick';

const ByRegion = ({ data, year }) => {
  const { regions } = useAPI();
  const intl = useIntl();
  const { config } = useConfig();

  /**
   * Manually calculating bar colors to create the fade-out effect.
   */
  const customColorProp = useCallback((maxYear, forecastYear, hexFunc) => (d) => {
    const opacityNumber = (d.indexValue > forecastYear)
      ? (1.5 - ((d.indexValue - forecastYear) / (maxYear - forecastYear)))
      : 1;
    return hexFunc(regions.colors[d.id], opacityNumber);
  }, [regions.colors]);

  const colors = customColorProp(year.max, year.forecastStart, convertHexToRGB);

  /**
   * The forecast bar.
   */
  const forecast = useMemo(() => forecastLayer({ year }), [year]);

  /**
   * Determine the region order shown in the stacked bar chart.
   */
  const keys = useMemo(() => [...config.provinceOrder].reverse(), [config.provinceOrder]);

  /**
   * Calculate the max tick value on y-axis and generate the all ticks accordingly.
   */
  const axis = useMemo(() => {
    const highest = data && Math.max(...data
      .map(seg => Object.values(seg).reduce((a, b) => a + (typeof b === 'string' ? 0 : b), 0)));
    return getMaxTick(highest);
  }, [data]);
  const axisFormat = useCallback(
    value => (Math.abs(value - Math.max(...axis.ticks)) < Number.EPSILON
      ? <MaxTick value={value} unit={config.unit} />
      : value),
    [axis.ticks, config.unit],
  );

  if (!data) {
    return null;
  }

  return (
    <ResponsiveBar
      {...CHART_PROPS}
      data={data}
      keys={keys}
      layers={['grid', 'axes', 'bars', 'markers', forecast]}
      indexBy="year"
      maxValue={axis.highest}
      colors={colors}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisBottom={{
        ...CHART_AXIS_PROPS,
        format: yearLabel => ((yearLabel % 5) ? '' : yearLabel),
      }}
      axisRight={{
        ...CHART_AXIS_PROPS,
        tickValues: axis.ticks,
        format: axisFormat,
      }}
      tooltipFormat={value => formatUnitAbbreviation(value, intl.formatMessage({ id: `common.units.${config.unit}` }))}
      gridYValues={axis.ticks}
    />
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
