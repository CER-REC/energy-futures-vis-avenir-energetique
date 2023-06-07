import React, { useCallback, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';
import useConfig from '../../hooks/useConfig';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';
import analytics from '../../analytics';

import { CHART_PROPS, CHART_AXIS_PROPS, SCENARIO_COLOR } from '../../constants';
import ForecastLayer from '../../components/ForecastLayer';
import HistoricalLayer from '../../components/HistoricalLayer';
import PriceSelect from '../../components/PriceSelect';
import getYearLabel from '../../utilities/getYearLabel';
import { getTicks, formatLineData } from '../../utilities/parseData';
import BenchmarkCrosshair from '../../components/BenchmarkCrosshair';
import YearSliceTooltip from '../../components/YearSliceTooltip';

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
    '&.duo': { height: theme.mixins.chart.height / 2 },
  },
}));

const Scenarios = ({ data, year }) => {
  const intl = useIntl();
  const { config } = useConfig();
  const [upperSlice, setUpperSlice] = useState(null);
  const [lowerSlice, setLowerSlice] = useState(null);
  // TODO: Refactor useEnergyFutureData hook to use a standard data structure
  const { prices, priceYear } = useEnergyFutureData();
  const classes = useStyles();
  const priceData = formatLineData(prices, 'scenario');

  /**
   * The dotted line layer that represents the default scenario.
   */
  const dots = useMemo(() => dottedLayer(config.yearId), [config.yearId]);

  const getLineTicks = (pointData) => {
    const values = (pointData || []).map(source => source.data);
    const sums = (values[0] || [])
      .map((_, i) => Math.max(...values.map(source => source[i].y)));
    return getTicks(Math.max(...sums));
  };

  const ticks = getLineTicks(data);
  const benchmarkTicks = getLineTicks(priceData);

  const getNodesFromData = useCallback((currYear, nodeData) => nodeData.map((scenario) => {
    const yearData = scenario.data.find(obj => obj.x === currYear);
    return {
      name: intl.formatMessage({ id: `common.scenarios.${scenario.id}` }),
      value: yearData?.y,
      color: SCENARIO_COLOR[scenario.id],
    };
  }), [intl]);

  const timer = useRef(null);
  const getTooltip = useCallback((event) => {
    // capture hover event and use a timer to avoid throttling
    const index = Number((event?.slice?.points[0].id || '').split('.')[1]);
    if (!Number.isNaN(index) && year?.min) {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => analytics.reportPoi(config.page, year.min + index), 500);
    }

    const currYear = event.slice?.points[0].data?.x;
    const upperNodes = getNodesFromData(currYear, data).reverse();
    let lowerNodes = [];

    if (prices?.length) {
      lowerNodes = getNodesFromData(currYear, priceData).reverse();
    }

    const sections = [];
    sections.push({
      title: intl.formatMessage({ id: `common.selections.${config.mainSelection}` }),
      nodes: upperNodes,
      unit: intl.formatMessage({ id: `common.units.${config.unit}` }),
    });

    if (prices?.length) {
      sections.push({
        title: intl.formatMessage({ id: `containers.scenarios.benchmark.${config.mainSelection}TooltipTitle` }),
        nodes: lowerNodes,
        unit: intl.formatMessage({ id: `common.prices.${config.priceSource}` }),
        isPrice: true,
      });
    }

    return (
      <YearSliceTooltip
        sections={sections}
        year={currYear?.toString()}
        isSliceTooltip
      />
    );
  }, [year, getNodesFromData, data, prices, intl,
    config.mainSelection, config.unit, config.page, config.priceSource, priceData]);

  if (!data) {
    return null;
  }

  const lineProps = {
    colors: d => SCENARIO_COLOR[d.id] || '#AAA',
    xScale: { type: 'point' },
    enablePoints: false,
    lineWidth: 3,
    pointColor: { theme: 'background' },
    pointBorderWidth: 2,
    pointBorderColor: { from: 'serieColor' },
    pointLabel: 'y',
    pointLabelYOffset: -12,
    axisBottom: {
      ...CHART_AXIS_PROPS,
      format: getYearLabel,
    },
    enableSlices: 'x',
    forecastStart: year.forecastStart,
  };
  const chartContainerClass = clsx(classes.chart, { duo: !!prices?.length });

  return (
    <>
      <div className={chartContainerClass}>
        <ResponsiveLine
          {...CHART_PROPS}
          {...lineProps}
          data={data}
          enableArea
          layers={[HistoricalLayer, 'grid', 'axes', 'areas', BenchmarkCrosshair, 'points', 'slices', 'lines', ForecastLayer, dots]}
          curve="cardinal"
          areaOpacity={0.15}
          yScale={{ type: 'linear', min: 0, max: ticks[ticks.length - 1], reverse: false }}
          axisRight={{
            ...CHART_AXIS_PROPS,
            tickValues: ticks,
          }}
          sliceTooltip={event => getTooltip(event, true)}
          axisBottom={prices?.length ? null : lineProps.axisBottom}
          gridYValues={ticks}
          setSlice={setLowerSlice}
          slice={upperSlice}
        />
      </div>
      { !!prices?.length && (
        <div style={{ display: 'flex' }}>
          <Typography variant="h6" style={{ flex: 1 }}>
            {
              intl.formatMessage({
                id: `containers.scenarios.benchmark.${config.mainSelection}`,
              }, {
                year: priceYear,
              })
            }
          </Typography>
          <PriceSelect />
        </div>
      )}
      { !!prices?.length && (
        <div className={chartContainerClass}>
          <ResponsiveLine
            {...CHART_PROPS}
            {...lineProps}
            data={priceData}
            layers={[HistoricalLayer, 'grid', 'axes', BenchmarkCrosshair, 'points', 'slices', 'lines', ForecastLayer, dots]}
            yScale={{ type: 'linear', min: 0, max: benchmarkTicks[benchmarkTicks.length - 1], reverse: false }}
            axisRight={{
              ...CHART_AXIS_PROPS,
              tickValues: benchmarkTicks,
            }}
            sliceTooltip={event => getTooltip(event)}
            gridYValues={benchmarkTicks}
            setSlice={setUpperSlice}
            slice={lowerSlice}
          />
        </div>
      )}
    </>
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
