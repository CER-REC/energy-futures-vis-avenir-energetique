import React, { useCallback, useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { makeStyles } from '@material-ui/core';
import { useIntl } from 'react-intl';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import convertHexToRGB from '../../utilities/convertHexToRGB';
import { getTicks } from '../../utilities/parseData';
import { CHART_PROPS, GREENHOUSE_GAS_MARKERS } from '../../constants';
import NetBarLineLayer from '../../components/NetBarLineLayer';
import HistoricalLayer from '../../components/HistoricalLayer';
import ForecastLayer from '../../components/ForecastLayer';
import getYearLabel from '../../utilities/getYearLabel';
import YearSliceTooltip from '../../components/YearSliceTooltip';
import defaultTheme from '../../containers/App/theme';
import UnavailableDataMessage from '../../components/UnavailableDataMessage';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';

const useStyles = makeStyles(theme => ({
  chart: {
    ...theme.mixins.chart,
  },
}));

const Emissions = () => {
  const { sources: { greenhouseGas: sources } } = useAPI();
  const { data, year } = useEnergyFutureData();
  const { config } = useConfig();
  const classes = useStyles();
  const intl = useIntl();

  const customColorProp = useCallback(
    () => d => convertHexToRGB(sources.colors[d.id], 0.75), [sources.colors],
  );

  const colors = useMemo(
    () => customColorProp(year.max, year.forecastStart),
    [customColorProp, year],
  );

  const keys = sources.order.slice().reverse();
  const getTooltip = useCallback((entry) => {
    const nodes = [];

    sources.order.forEach((key) => {
      if (entry.data[key]) {
        nodes.push({
          name: intl.formatMessage({ id: `common.sources.greenhouseGas.${key}` }),
          value: entry.data[key],
          color: sources.colors[key],
        });
      }
    });

    const section = {
      title: intl.formatMessage({ id: `common.scenarios.${config.scenarios[0]}` }),
      nodes,
      unit: intl.formatMessage({ id: `common.units.${config.unit}` }),
      totalLabel: intl.formatMessage({ id: 'common.netEmissions' }),
    };

    return (
      <YearSliceTooltip
        sections={[section]}
        year={entry.indexValue}
      />
    );
  }, [config.scenarios, config.unit, intl, sources.colors, sources.order]);

  const processedData = useMemo(() => {
    if (!data) return null;

    const byYear = data.reduce((yearEmissions, emission) => {
      const yearSources = { ...yearEmissions };
      const yearKey = emission.year;
      const { source } = emission;

      yearSources[yearKey] = yearSources[yearKey] || {};
      yearSources[yearKey][source] = yearSources[yearKey][source] || 0;
      yearSources[yearKey][source] += emission.value;

      return yearSources;
    }, {});

    return Object.keys(byYear).map(yearKey => ({ year: yearKey, ...byYear[yearKey] }));
  }, [data]);

  const ticks = useMemo(() => {
    const highest = processedData && Math.max(...processedData
      .map(seg => Object.values(seg).reduce((a, b) => {
        if (typeof b === 'string' || b < 0) return a;
        return a + b;
      }, 0)));
    const lowest = processedData && Math.min(...processedData
      .map(seg => Object.values(seg).reduce((a, b) => {
        if (typeof b === 'string' || b > 0) return a;
        return a + b;
      }, 0)));

    return getTicks(highest, lowest);
  }, [processedData]);

  const xAxisGridLines = useMemo(() => {
    if (!processedData) return [];
    const allYears = processedData.map(entry => entry.year);
    return allYears.filter(value => getYearLabel(value) !== '');
  }, [processedData]);

  if (config.yearId < 2023) {
    return (
      <UnavailableDataMessage
        hasEmissionsLink
      />
    );
  }

  return processedData ? (
    <div className={classes.chart}>
      <ResponsiveBar
        {...CHART_PROPS}
        data={processedData}
        keys={keys}
        layers={[HistoricalLayer, 'grid', 'axes', 'bars', 'markers', ForecastLayer, NetBarLineLayer]}
        padding={0.4}
        indexBy="year"
        maxValue={ticks[ticks.length - 1]}
        minValue={ticks[0]}
        colors={colors}
        axisBottom={{
          tickSize: 0,
          format: getYearLabel,
        }}
        axisRight={{
          tickSize: 0,
          tickValues: ticks,
        }}
        enableGridX
        tooltip={getTooltip}
        gridXValues={xAxisGridLines}
        gridYValues={ticks}
        motionStiffness={300}
        forecastStart={year.forecastStart}
        markers={GREENHOUSE_GAS_MARKERS}
        theme={{
          tooltip: {
            ...defaultTheme.overrides.MuiTooltip.tooltip,
          },
        }}
      />
    </div>
  ) : (
    <UnavailableDataMessage
      message={intl.formatMessage({ id: 'common.unavailableData.noSourceSelected' })}
    />
  );
};

export default Emissions;
