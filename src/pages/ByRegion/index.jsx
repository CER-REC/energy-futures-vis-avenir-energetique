import React, { useMemo, useCallback, useRef } from 'react';
import { useIntl } from 'react-intl';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import analytics from '../../analytics';
import { CHART_PROPS, CHART_AXIS_PROPS } from '../../constants';
import { getMaxTick } from '../../utilities/parseData';
import convertHexToRGB from '../../utilities/convertHexToRGB';
import forecastLayer from '../../components/ForecastLayer';
import VizTooltip from '../../components/VizTooltip';
import MaxTick from '../../components/MaxTick';

const ByRegion = ({ data, year }) => {
  const intl = useIntl();

  const { regions } = useAPI();
  const { config } = useConfig();

  /**
   * Manually calculating bar colors to create the fade-out effect.
   */
  const customColorProp = useCallback((maxYear, forecastYear) => (d) => {
    const opacityNumber = (d.indexValue > forecastYear)
      ? (1.1 - ((d.indexValue - forecastYear) / (maxYear - forecastYear)))
      : 1;
    return convertHexToRGB(regions.colors[d.id], opacityNumber);
  }, [regions.colors]);

  const colors = useMemo(
    () => customColorProp(year.max, year.forecastStart),
    [customColorProp, year],
  );

  /**
   * The forecast bar.
   */
  const forecast = useMemo(() => forecastLayer({ year, label: intl.formatMessage({ id: 'common.forecast' }) }), [year, intl]);

  /**
   * Determine the region order shown in the stacked bar chart.
   */
  const keys = useMemo(() => config.provinceOrder?.slice().reverse(), [config.provinceOrder]);

  /**
   * Format tooltip.
   */
  const timer = useRef(null);
  const getTooltip = useCallback((entry) => {
    // capture hover event and use a timer to avoid throttling
    const name = `${entry.id} - ${entry.indexValue}`;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => analytics.reportPoi(config.page, name), 500);
    return (
      <VizTooltip
        nodes={[{ name, value: entry.value, color: entry.color }]}
        unit={config.unit}
      />
    );
  }, [config.page, config.unit]);

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
    <div style={{ height: 700 }}>
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
        tooltip={getTooltip}
        gridYValues={axis.ticks}
        motionStiffness={300}
      />
    </div>
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
