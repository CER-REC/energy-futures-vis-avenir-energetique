import React, { useMemo, useCallback } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { makeStyles } from '@material-ui/core';
import { useIntl } from 'react-intl';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import { CHART_PROPS, CHART_AXIS_PROPS } from '../../constants';
import { getTicks } from '../../utilities/parseData';
import convertHexToRGB from '../../utilities/convertHexToRGB';
import ForecastLayer from '../../components/ForecastLayer';
import HistoricalLayer from '../../components/HistoricalLayer';
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

const processData = (data, unitConversion) => {
  if (!data) return null;

  const byYear = data?.reduce((accu, curr) => {
    const result = { ...accu };
    if (!result[curr.year]) {
      result[curr.year] = {};
    }
    if (!result[curr.year][curr.province]) {
      result[curr.year][curr.province] = 0;
    }
    result[curr.year][curr.province] += (
      curr.value * unitConversion
    );
    return result;
  }, {});

  return Object.keys(byYear).map(yearKey => ({ year: yearKey, ...byYear[yearKey] }));
};

const ByRegion = () => {
  const { regions } = useAPI();
  const { config } = useConfig();
  const { data, year, unitConversion } = useEnergyFutureData();
  const classes = useStyles();
  const intl = useIntl();

  const customColorProp = useCallback(
    () => d => convertHexToRGB(regions.colors[d.id], 1), [regions.colors],
  );

  const colors = useMemo(
    () => customColorProp(year.max, year.forecastStart),
    [customColorProp, year],
  );

  const keys = useMemo(() => config.provinceOrder?.slice().reverse(), [config.provinceOrder]);
  const getTooltip = useCallback((entry) => {
    const nodes = [];

    config.provinceOrder.forEach((key) => {
      if (entry.data[key]) {
        nodes.push({
          name: intl.formatMessage({ id: `common.regions.${key}` }),
          value: entry.data[key],
          color: regions.colors[key],
        });
      }
    });

    const section = {
      title: intl.formatMessage({ id: `common.scenarios.${config.scenarios[0]}` }),
      nodes,
      unit: intl.formatMessage({ id: `common.units.${config.unit}` }),
      totalLabel: intl.formatMessage({ id: 'common.total' }),
    };

    return (
      <YearSliceTooltip
        sections={[section]}
        year={entry.indexValue}
      />
    );
  }, [config.scenarios, config.unit, intl, regions.colors, config.provinceOrder]);

  const processedData = processData(data, unitConversion);

  const ticks = useMemo(() => {
    const highest = processedData && Math.max(...processedData
      .map(seg => Object.values(seg).reduce((a, b) => a + (typeof b === 'string' ? 0 : b), 0)));
    return getTicks(highest);
  }, [processedData]);

  if (!processedData) {
    let noDataMessageId = `common.unavailableData.${config.mainSelection}.${config.provinces.join()}`;

    if (config.provinces.length <= 0) noDataMessageId = 'common.unavailableData.noRegionSelected';

    return (
      <UnavailableDataMessage
        message={intl.formatMessage({
          id: noDataMessageId,
          defaultMessage: intl.formatMessage({ id: 'common.unavailableData.default' }),
        })}
      />
    );
  }

  return (
    <div className={classes.chart}>
      <ResponsiveBar
        {...CHART_PROPS}
        data={processedData}
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
        theme={{
          tooltip: {
            ...defaultTheme.overrides.MuiTooltip.tooltip,
          },
        }}
      />
    </div>
  );
};

export default ByRegion;
