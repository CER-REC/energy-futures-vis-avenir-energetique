import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
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
import { getTicks, formatLineData } from '../../utilities/parseData';
import BenchmarkCrosshair from '../../components/BenchmarkCrosshair';
import YearSliceTooltip from '../../components/YearSliceTooltip';
import hasNoData from '../../utilities/hasNoData';
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

const Scenarios = ({ data, year }) => {
  const intl = useIntl();
  const { config } = useConfig();
  const [upperSlice, setUpperSlice] = useState(null);
  const [lowerSlice, setLowerSlice] = useState(null);
  // TODO: Refactor useEnergyFutureData hook to use a standard data structure
  const { prices, priceYear, rawData } = useEnergyFutureData();
  const classes = useStyles();
  const priceData = formatLineData(prices, 'scenario');

  /**
   * The dotted line layer that represents the default scenario.
   */
  const dots = useMemo(() => dottedLayer(config.yearId), [config.yearId]);

  const getNodesFromData = useCallback((currYear, nodeData) => nodeData.map((scenario) => {
    const yearData = scenario.data.find(obj => obj.x === currYear);
    return {
      name: intl.formatMessage({ id: `common.scenarios.${scenario.id}` }),
      value: yearData?.y,
      color: SCENARIO_COLOR[scenario.id],
    };
  }), [intl]);

  const getTooltip = useCallback((event) => {
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
  }, [
    getNodesFromData, data, prices, intl,
    config.mainSelection, config.unit, config.priceSource, priceData,
  ]);

  if (config.mainSelection === 'greenhouseGasEmission' && config.yearId < 2023) {
    return (
      <UnavailableDataMessage
        message={intl.formatMessage({ id: 'components.unavailableData.emissionsUnavailable' })}
        hasEmissionsLink
      />
    );
  }

  const ticks = getLineTicks(data || []);
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
          data && !hasNoData(rawData) ? (
            <ResponsiveLine
              {...CHART_PROPS}
              {...lineProps}
              data={data}
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
            <UnavailableDataMessage message={intl.formatMessage({
              id: `components.unavailableData.${config.mainSelection}.${config.provinces[0]}`,
              defaultMessage: intl.formatMessage({ id: 'components.unavailableData.noSourceSelected' }),
            })}
            />
          )
        }
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
