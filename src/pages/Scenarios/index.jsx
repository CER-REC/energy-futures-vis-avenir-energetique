import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import { ResponsiveLine } from '@nivo/line';
import { makeStyles, Typography } from '@material-ui/core';
import useConfig from '../../hooks/useConfig';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';

import {
  CHART_PROPS,
  CHART_AXIS_PROPS,
  SCENARIO_COLOR,
  GREENHOUSE_GAS_MARKERS,
} from '../../constants';
import ForecastLayer from '../../components/ForecastLayer';
import HistoricalLayer from '../../components/HistoricalLayer';
import PriceSelect from '../../components/PriceSelect';
import getYearLabel from '../../utilities/getYearLabel';
import { getTicks, formatLineData, formatTotalLineData } from '../../utilities/parseData';
import BenchmarkCrosshair from '../../components/BenchmarkCrosshair';
import YearSliceTooltip from '../../components/YearSliceTooltip';
import UnavailableDataMessage from '../../components/UnavailableDataMessage';

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

const getLineTicks = (lineData) => {
  const values = lineData.map(scenarios => scenarios.data).flat().map(point => point.y);

  return getTicks(Math.max(...values), Math.min(0, ...values));
};

const useStyles = makeStyles(theme => ({
  chart: {
    ...theme.mixins.chart,
    '&.duo': { height: theme.mixins.chart.height / 2 },
  },
}));

const Scenarios = () => {
  const intl = useIntl();
  const { config } = useConfig();
  const [upperSlice, setUpperSlice] = useState(null);
  const [lowerSlice, setLowerSlice] = useState(null);
  const { data, year, unitConversion, prices, priceYear } = useEnergyFutureData();
  const classes = useStyles();
  const priceData = formatLineData(prices, 'scenario');
  let processedData = formatLineData(data, 'scenario', unitConversion);
  if (config.mainSelection === 'greenhouseGasEmission') processedData = formatTotalLineData(data);

  /**
   * The dotted line layer that represents the default scenario.
   */
  const dots = useMemo(() => dottedLayer(config.yearId), [config.yearId]);

  const getNodesFromData = useCallback((currYear, nodeData, upperNodeOrder) => {
    const currYearData = [];

    const order = upperNodeOrder || config.scenarios;

    order.forEach((key) => {
      const scenario = nodeData.find(item => item.id === key);
      const yearData = scenario.data.find(obj => obj.x === currYear);
      currYearData.push({
        name: intl.formatMessage({ id: `common.scenarios.${scenario.id}` }),
        value: yearData?.y,
        color: SCENARIO_COLOR[scenario.id],
      });
    });

    if (!upperNodeOrder) {
      currYearData.sort((a, b) => b.value - a.value);
    }

    return currYearData;
  }, [config.scenarios, intl]);

  const getTooltip = useCallback((event) => {
    const currYear = event.slice?.points[0].data?.x;
    const upperNodes = getNodesFromData(currYear, processedData);
    let lowerNodes = [];

    if (prices?.length) {
      const order = upperNodes.map(item => item.name);
      lowerNodes = getNodesFromData(currYear, priceData, order);
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
  }, [
    getNodesFromData, processedData, prices, intl,
    config.mainSelection, config.unit, config.priceSource, priceData,
  ]);

  if (config.mainSelection === 'greenhouseGasEmission' && config.yearId < 2023) {
    return (
      <UnavailableDataMessage
        hasEmissionsLink
      />
    );
  }

  const ticks = getLineTicks(processedData || []);
  const benchmarkTicks = getLineTicks(priceData);
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
        {
          processedData?.length ? (
            <ResponsiveLine
              {...CHART_PROPS}
              {...lineProps}
              data={processedData}
              enableArea
              layers={[HistoricalLayer, 'grid', 'axes', 'areas', BenchmarkCrosshair, 'points', 'slices', 'lines', 'markers', ForecastLayer, dots]}
              curve="catmullRom"
              areaOpacity={0.15}
              yScale={{ type: 'linear', min: ticks[0], max: ticks[ticks.length - 1], reverse: false }}
              axisRight={{
                ...CHART_AXIS_PROPS,
                tickValues: ticks,
              }}
              sliceTooltip={event => getTooltip(event, true)}
              axisBottom={prices?.length ? null : lineProps.axisBottom}
              gridYValues={ticks}
              markers={config.mainSelection === 'greenhouseGasEmission' ? GREENHOUSE_GAS_MARKERS : null}
              setSlice={setLowerSlice}
              slice={upperSlice}
            />
          ) : (
            <UnavailableDataMessage
              message={intl.formatMessage({
                id: `common.unavailableData.${config.mainSelection}.${config.provinces[0]}`,
                defaultMessage: intl.formatMessage({ id: 'common.unavailableData.noSourceSelected' }),
              })}
            />
          )
        }
      </div>

      {!!prices?.length && (
        <>
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
        </>
      )}
    </>
  );
};

export default Scenarios;
