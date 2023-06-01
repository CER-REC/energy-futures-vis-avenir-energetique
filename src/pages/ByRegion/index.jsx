import React, { useMemo, useCallback, useRef } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import analytics from '../../analytics';
import { CHART_PROPS, CHART_AXIS_PROPS } from '../../constants';
import { getTicks } from '../../utilities/parseData';
import convertHexToRGB from '../../utilities/convertHexToRGB';
import ForecastLayer from '../../components/ForecastLayer';
import VizTooltip from '../../components/VizTooltip';
import HistoricalLayer from '../../components/HistoricalLayer';
import getYearLabel from '../../utilities/getYearLabel';

const useStyles = makeStyles(theme => ({
  chart: {
    ...theme.mixins.chart,
  },
}));

const ByRegion = ({ data, year }) => {
  const { regions } = useAPI();
  const { config } = useConfig();
  const classes = useStyles();

  /**
   * Calculate bar colors.
   */
  const customColorProp = useCallback(
    () => d => convertHexToRGB(regions.colors[d.id], 1), [regions.colors],
  );

  const colors = useMemo(
    () => customColorProp(year.max, year.forecastStart),
    [customColorProp, year],
  );

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
  const ticks = useMemo(() => {
    const highest = data && Math.max(...data
      .map(seg => Object.values(seg).reduce((a, b) => a + (typeof b === 'string' ? 0 : b), 0)));
    return getTicks(highest);
  }, [data]);

  if (!data) {
    return null;
  }

  return (
    <div className={classes.chart}>
      <ResponsiveBar
        {...CHART_PROPS}
        data={data}
        keys={keys}
        layers={[HistoricalLayer, 'grid', 'axes', 'bars', 'markers', ForecastLayer]}
        indexBy="year"
        maxValue={ticks[ticks.length - 1]}
        colors={colors}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisBottom={{
          ...CHART_AXIS_PROPS,
          format: getYearLabel,
        }}
        axisRight={{
          ...CHART_AXIS_PROPS,
          tickValues: ticks,
        }}
        tooltip={getTooltip}
        gridYValues={ticks}
        motionStiffness={300}
        forecastStart={year.forecastStart}
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
