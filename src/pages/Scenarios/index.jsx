import React, { useCallback, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import useConfig from '../../hooks/useConfig';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';
import analytics from '../../analytics';

import { CHART_PROPS, CHART_AXIS_PROPS, SCENARIO_COLOR } from '../../constants';
import { fillLayerScenario } from '../../components/FillLayer';
import ForecastLayer from '../../components/ForecastLayer';
import HistoricalLayer from '../../components/HistoricalLayer';
import getYearLabel from '../../utilities/getYearLabel';
import { getTicks, formatLineData } from '../../utilities/parseData';
import YearSliceTooltip from "../../components/YearSliceTooltip";

/**
 * Generate a custom dotted line layer for rendering the default scenario.
 */
const dotsFilter = (scenarioYear) => {
  // Returns the name of the scenario that needs to be dotted for each year
  switch (scenarioYear) {
    case '2020':
      return 'Evolving';

    case '2021':
      return 'Evolving Policies';

    default:
      return 'Reference';
  }
};
export const dottedLayer = scenarioYear => args => args.points
  .filter(point => point.serieId === dotsFilter(scenarioYear))
  .map(point => (
    <circle
      key={point.id}
      cx={point.x}
      cy={point.y}
      r={args.pointSize / 2}
      fill="#FFF"
      stroke={point.borderColor}
      strokeWidth={args.pointBorderWidth}
      style={{ pointerEvents: 'none' }}
    />
  ));

const useStyles = makeStyles(theme => ({
  chart: {
    ...theme.mixins.chart,
  },
  fullChart: {
    height: '100%',
  },
  halvedChartSize: {
    height: theme.mixins.chart.height / 2,
  },
}));

const Scenarios = ({ data, year }) => {
  const intl = useIntl();
  const { config } = useConfig();
  // TODO: Refactor useEnergyFutureData hook to use a standard data structure
  const { prices } = useEnergyFutureData();
  const classes = useStyles();
  const priceData = formatLineData(prices, 'scenario');

  /**
   * The dotted line layer that represents the default scenario.
   */
  const dots = useMemo(() => dottedLayer(config.yearId), [config.yearId]);

  const fill = useMemo(() => fillLayerScenario({ year }), [year]);

  const getLineTicks = (pointData) => {
    const values = (pointData || []).map(source => source.data);
    const sums = (values[0] || [])
      .map((_, i) => Math.max(...values.map(source => source[i].y)));
    return getTicks(Math.max(...sums));
  };

  const ticks = getLineTicks(data);
  const benchmarkTicks = getLineTicks(priceData);

  const timer = useRef(null);
  const getTooltip = useCallback((event) => {
    // capture hover event and use a timer to avoid throttling
    const index = Number((event?.slice?.points[0].id || '').split('.')[1]);
    if (!Number.isNaN(index) && year?.min) {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => analytics.reportPoi(config.page, year.min + index), 500);
    }

    let currYear = '';

    const upperSection = {
      title: intl.formatMessage({ id: `common.selections.${config.mainSelection}` }),
      nodes: event.slice?.points.map((obj) => {
        if (!currYear) currYear = obj.data?.x.toString();

        return {
          name: intl.formatMessage({ id: `common.scenarios.${obj.serieId}` }),
          value: obj.data?.y,
          color: obj.serieColor,
        };
      }),
      hasTotal: false,
      unit: config.unit,
    };

    return (
      <YearSliceTooltip
        sections={[upperSection]}
        year={currYear}
        isSliceTooltip
      />
    );
  }, [year, intl, config.mainSelection, config.unit, config.page]);

  if (!data) {
    return null;
  }

  const lineProps = {
    xScale: { type: 'point' },
    enablePoints: false,
    colors: d => SCENARIO_COLOR[d.id] || '#AAA',
    pointSize: 8,
    pointColor: { theme: 'background' },
    pointBorderWidth: 2,
    pointBorderColor: { from: 'serieColor' },
    pointLabel: 'y',
    pointLabelYOffset: -12,
    axisBottom: {
      ...CHART_AXIS_PROPS,
      format: getYearLabel,
    },
    axisRight: {
      ...CHART_AXIS_PROPS,
      tickValues: benchmarkTicks,
    },
    enableSlices: 'x',
    sliceTooltip: getTooltip,
    forecastStart: year.forecastStart,
  };

  return (
    <div className={classes.chart}>
      <div className={
        prices?.length
          ? classes.halvedChartSize
          : classes.fullChart
      }
      >
        <ResponsiveLine
          {...CHART_PROPS}
          {...lineProps}
          data={data}
          enableArea
          enablePoints={false}
          layers={[HistoricalLayer, 'grid', 'axes', 'areas', 'crosshair', 'points', 'slices', fill, 'lines', ForecastLayer, dots]}
          curve="cardinal"
          areaOpacity={0.15}
          yScale={{ type: 'linear', min: 0, max: ticks[ticks.length - 1], reverse: false }}
          axisRight={{
            tickValues: ticks,
          }}
          gridYValues={ticks}
        />
      </div>
      {
        !!prices?.length && (
          <div className={classes.halvedChartSize}>
            <ResponsiveLine
              {...CHART_PROPS}
              {...lineProps}
              data={priceData}
              layers={[HistoricalLayer, 'grid', 'axes', 'crosshair', 'points', 'slices', 'lines', ForecastLayer, dots]}
              yScale={{ type: 'linear', min: 0, max: benchmarkTicks[benchmarkTicks.length - 1], reverse: false }}
              axisRight={{
                tickValues: benchmarkTicks,
              }}
              gridYValues={benchmarkTicks}
              forecastStart={year.forecastStart}
            />
          </div>
        )
      }
    </div>
  );
};

Scenarios.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  year: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
    forecastStart: PropTypes.number,
  }),
};

Scenarios.defaultProps = {
  data: undefined,
  year: {
    min: 0,
    max: 0,
    forecastStart: 0,
  },
};

export default Scenarios;
