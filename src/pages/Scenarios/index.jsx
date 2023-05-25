import React, { useCallback, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import useConfig from '../../hooks/useConfig';
import analytics from '../../analytics';

import { CHART_PROPS, CHART_AXIS_PROPS, SCENARIO_COLOR } from '../../constants';
import { getTicks } from '../../utilities/parseData';
import { fillLayerScenario } from '../../components/FillLayer';
import ForecastLayer from '../../components/ForecastLayer';
import VizTooltip from '../../components/VizTooltip';
import HistoricalLayer from '../../components/HistoricalLayer';
import getYearLabel from '../../utilities/getYearLabel';

const priceData = [
  {
    id: 'Canada Net-zero',
    data: [
      {
        x: 2005,
        y: 83.8725402193,
      },
      {
        x: 2006,
        y: 94.795306195,
      },
      {
        x: 2007,
        y: 100.9599326092,
      },
      {
        x: 2008,
        y: 133.8951581171,
      },
      {
        x: 2009,
        y: 83.544372685,
      },
      {
        x: 2010,
        y: 105.4648595746,
      },
      {
        x: 2011,
        y: 122.5444233148,
      },
      {
        x: 2012,
        y: 119.0452748002,
      },
      {
        x: 2013,
        y: 122.0030788548,
      },
      {
        x: 2014,
        y: 114.0469577163,
      },
      {
        x: 2015,
        y: 58.9571886644,
      },
      {
        x: 2016,
        y: 51.9715686404,
      },
      {
        x: 2017,
        y: 59.7664732416,
      },
      {
        x: 2018,
        y: 74.7768874064,
      },
      {
        x: 2019,
        y: 64.3523736406,
      },
      {
        x: 2020,
        y: 43.6621178125,
      },
      {
        x: 2021,
        y: 72.9845273018,
      },
      {
        x: 2022,
        y: 94.91,
      },
      {
        x: 2023,
        y: 80,
      },
      {
        x: 2024,
        y: 76,
      },
      {
        x: 2025,
        y: 74.8333333333,
      },
      {
        x: 2026,
        y: 72.1666666666,
      },
      {
        x: 2027,
        y: 69.5,
      },
      {
        x: 2028,
        y: 66.8333333333,
      },
      {
        x: 2029,
        y: 64.1666666666,
      },
      {
        x: 2030,
        y: 61.5,
      },
      {
        x: 2031,
        y: 61.3,
      },
      {
        x: 2032,
        y: 61.1,
      },
      {
        x: 2033,
        y: 60.9,
      },
      {
        x: 2034,
        y: 60.7,
      },
      {
        x: 2035,
        y: 60.5,
      },
      {
        x: 2036,
        y: 60.3,
      },
      {
        x: 2037,
        y: 60.1,
      },
      {
        x: 2038,
        y: 59.9,
      },
      {
        x: 2039,
        y: 59.7,
      },
      {
        x: 2040,
        y: 59.5,
      },
      {
        x: 2041,
        y: 59.3,
      },
      {
        x: 2042,
        y: 59.1,
      },
      {
        x: 2043,
        y: 58.9,
      },
      {
        x: 2044,
        y: 58.7,
      },
      {
        x: 2045,
        y: 58.5,
      },
      {
        x: 2046,
        y: 58.3,
      },
      {
        x: 2047,
        y: 58.1,
      },
      {
        x: 2048,
        y: 57.9,
      },
      {
        x: 2049,
        y: 57.7,
      },
      {
        x: 2050,
        y: 57.5,
      },
    ],
  },
  {
    id: 'Current Measures',
    data: [
      {
        x: 2005,
        y: 83.8725402193,
      },
      {
        x: 2006,
        y: 94.795306195,
      },
      {
        x: 2007,
        y: 100.9599326092,
      },
      {
        x: 2008,
        y: 133.8951581171,
      },
      {
        x: 2009,
        y: 83.544372685,
      },
      {
        x: 2010,
        y: 105.4648595746,
      },
      {
        x: 2011,
        y: 122.5444233148,
      },
      {
        x: 2012,
        y: 119.0452748002,
      },
      {
        x: 2013,
        y: 122.0030788548,
      },
      {
        x: 2014,
        y: 114.0469577163,
      },
      {
        x: 2015,
        y: 58.9571886644,
      },
      {
        x: 2016,
        y: 51.9715686404,
      },
      {
        x: 2017,
        y: 59.7664732416,
      },
      {
        x: 2018,
        y: 74.7768874064,
      },
      {
        x: 2019,
        y: 64.3523736406,
      },
      {
        x: 2020,
        y: 43.6621178125,
      },
      {
        x: 2021,
        y: 72.9845273018,
      },
      {
        x: 2022,
        y: 94.91,
      },
      {
        x: 2023,
        y: 80,
      },
      {
        x: 2024,
        y: 76,
      },
      {
        x: 2025,
        y: 76.6666666666,
      },
      {
        x: 2026,
        y: 75.8333333333,
      },
      {
        x: 2027,
        y: 75,
      },
      {
        x: 2028,
        y: 74.1666666666,
      },
      {
        x: 2029,
        y: 73.3333333333,
      },
      {
        x: 2030,
        y: 72.5,
      },
      {
        x: 2031,
        y: 72.5,
      },
      {
        x: 2032,
        y: 72.5,
      },
      {
        x: 2033,
        y: 72.5,
      },
      {
        x: 2034,
        y: 72.5,
      },
      {
        x: 2035,
        y: 72.5,
      },
      {
        x: 2036,
        y: 72.5,
      },
      {
        x: 2037,
        y: 72.5,
      },
      {
        x: 2038,
        y: 72.5,
      },
      {
        x: 2039,
        y: 72.5,
      },
      {
        x: 2040,
        y: 72.5,
      },
      {
        x: 2041,
        y: 72.5,
      },
      {
        x: 2042,
        y: 72.5,
      },
      {
        x: 2043,
        y: 72.5,
      },
      {
        x: 2044,
        y: 72.5,
      },
      {
        x: 2045,
        y: 72.5,
      },
      {
        x: 2046,
        y: 72.5,
      },
      {
        x: 2047,
        y: 72.5,
      },
      {
        x: 2048,
        y: 72.5,
      },
      {
        x: 2049,
        y: 72.5,
      },
      {
        x: 2050,
        y: 72.5,
      },
    ],
  },
  {
    id: 'Global Net-zero',
    data: [
      {
        x: 2005,
        y: 83.8725402193,
      },
      {
        x: 2006,
        y: 94.795306195,
      },
      {
        x: 2007,
        y: 100.9599326092,
      },
      {
        x: 2008,
        y: 133.8951581171,
      },
      {
        x: 2009,
        y: 83.544372685,
      },
      {
        x: 2010,
        y: 105.4648595746,
      },
      {
        x: 2011,
        y: 122.5444233148,
      },
      {
        x: 2012,
        y: 119.0452748002,
      },
      {
        x: 2013,
        y: 122.0030788548,
      },
      {
        x: 2014,
        y: 114.0469577163,
      },
      {
        x: 2015,
        y: 58.9571886644,
      },
      {
        x: 2016,
        y: 51.9715686404,
      },
      {
        x: 2017,
        y: 59.7664732416,
      },
      {
        x: 2018,
        y: 74.7768874064,
      },
      {
        x: 2019,
        y: 64.3523736406,
      },
      {
        x: 2020,
        y: 43.6621178125,
      },
      {
        x: 2021,
        y: 72.9845273018,
      },
      {
        x: 2022,
        y: 94.91,
      },
      {
        x: 2023,
        y: 80,
      },
      {
        x: 2024,
        y: 76,
      },
      {
        x: 2025,
        y: 70,
      },
      {
        x: 2026,
        y: 62.5,
      },
      {
        x: 2027,
        y: 55,
      },
      {
        x: 2028,
        y: 47.5,
      },
      {
        x: 2029,
        y: 40,
      },
      {
        x: 2030,
        y: 32.5,
      },
      {
        x: 2031,
        y: 31.95,
      },
      {
        x: 2032,
        y: 31.4,
      },
      {
        x: 2033,
        y: 30.85,
      },
      {
        x: 2034,
        y: 30.3,
      },
      {
        x: 2035,
        y: 29.75,
      },
      {
        x: 2036,
        y: 29.2,
      },
      {
        x: 2037,
        y: 28.65,
      },
      {
        x: 2038,
        y: 28.1,
      },
      {
        x: 2039,
        y: 27.55,
      },
      {
        x: 2040,
        y: 27,
      },
      {
        x: 2041,
        y: 26.45,
      },
      {
        x: 2042,
        y: 25.9,
      },
      {
        x: 2043,
        y: 25.35,
      },
      {
        x: 2044,
        y: 24.8,
      },
      {
        x: 2045,
        y: 24.25,
      },
      {
        x: 2046,
        y: 23.7,
      },
      {
        x: 2047,
        y: 23.15,
      },
      {
        x: 2048,
        y: 22.6,
      },
      {
        x: 2049,
        y: 22.05,
      },
      {
        x: 2050,
        y: 21.5,
      },
    ],
  },
];

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
  halvedChartSize: {
    height: theme.mixins.chart.height / 2,
  },
}));

const Scenarios = ({ data, year }) => {
  const intl = useIntl();
  const { config } = useConfig();
  const classes = useStyles();

  /**
   * The dotted line layer that represents the default scenario.
   */
  const dots = useMemo(() => dottedLayer(config.yearId), [config.yearId]);

  const fill = useMemo(() => fillLayerScenario({ year }), [year]);

  const ticks = useMemo(() => {
    const values = (data || []).map(source => source.data);
    const sums = (values[0] || [])
      .map((_, i) => Math.max(...values.map(source => source[i].y)));
    return getTicks(Math.max(...sums));
  }, [data]);

  const benchmarkTicks = useMemo(() => {
    const values = (priceData || []).map(source => source.data);
    const sums = (values[0] || [])
      .map((_, i) => Math.max(...values.map(source => source[i].y)));
    return getTicks(Math.max(...sums));
  }, []);

  const timer = useRef(null);
  const getTooltip = useCallback((event) => {
    // capture hover event and use a timer to avoid throttling
    const index = Number((event?.slice?.points[0].id || '').split('.')[1]);
    if (!Number.isNaN(index) && year?.min) {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => analytics.reportPoi(config.page, year.min + index), 500);
    }

    return (
      <VizTooltip
        nodes={event.slice?.points.map(value => ({
          name: value.serieId,
          translation: intl.formatMessage({ id: `common.scenarios.${value.serieId}` }),
          value: value.data?.y,
          color: value.serieColor,
        }))}
        unit={config.unit}
        paper
        showTotal={false}
        showPercentage={false}
      />
    );
  }, [timer, intl, config.unit, config.page, year]);

  if (!data) {
    return null;
  }

  return (
    <div className={classes.chart}>
      <div className={clsx({ [classes.halvedChartSize]: priceData })}>
        <ResponsiveLine
          {...CHART_PROPS}
          data={data}
          enableArea
          enablePoints={false}
          layers={[HistoricalLayer, 'grid', 'axes', 'areas', 'crosshair', 'points', 'slices', fill, 'lines', ForecastLayer, dots]}

          curve="cardinal"
          areaOpacity={0.15}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, max: ticks[ticks.length - 1], reverse: false }}
          colors={d => SCENARIO_COLOR[d.id] || '#AAA'}
          pointSize={8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabel="y"
          pointLabelYOffset={-12}
          axisBottom={{
            ...CHART_AXIS_PROPS,
            format: getYearLabel,
          }}
          axisRight={{
            ...CHART_AXIS_PROPS,
            tickValues: ticks,
          }}
          enableSlices="x"
          sliceTooltip={getTooltip}
          gridYValues={ticks}
          forecastStart={year.forecastStart}
        />
      </div>
      {
        priceData && (
          <div className={classes.halvedChartSize}>
            <ResponsiveLine
              {...CHART_PROPS}
              data={priceData}
              enablePoints={false}
              layers={[HistoricalLayer, 'grid', 'axes', 'crosshair', 'points', 'slices', 'lines', ForecastLayer, dots]}
              curve="cardinal"
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 0, max: benchmarkTicks[benchmarkTicks.length - 1], reverse: false }}
              colors={d => SCENARIO_COLOR[d.id] || '#AAA'}
              pointSize={8}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabel="y"
              pointLabelYOffset={-12}
              axisBottom={{
                ...CHART_AXIS_PROPS,
                format: getYearLabel,
              }}
              axisRight={{
                ...CHART_AXIS_PROPS,
                tickValues: benchmarkTicks,
              }}
              enableSlices="x"
              sliceTooltip={getTooltip}
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
