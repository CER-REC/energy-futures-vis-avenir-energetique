import React, { useCallback, useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useIntl } from 'react-intl';

import { makeStyles } from '@material-ui/core';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import { CHART_PROPS, CHART_AXIS_PROPS, CHART_PATTERNS, OIL_SUBGROUP } from '../../constants';
import { formatLineData, getTicks } from '../../utilities/parseData';

import FillLayer from '../../components/FillLayer';
import ForecastLayer from '../../components/ForecastLayer';
import HistoricalLayer from '../../components/HistoricalLayer';
import getYearLabel from '../../utilities/getYearLabel';
import YearSliceTooltip from '../../components/YearSliceTooltip';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';
import UnavailableDataMessage from '../../components/UnavailableDataMessage';

const useStyles = makeStyles(theme => ({
  chart: {
    ...theme.mixins.chart,
  },
}));

const BySector = () => {
  const intl = useIntl();
  const classes = useStyles();
  const {
    sources: {
      energy: { colors: energyColors },
      transportation: { colors: transportationColors },
    },
  } = useAPI();
  const { data, year, unitConversion } = useEnergyFutureData();
  const { config } = useConfig();

  const isTransportation = useMemo(() => config.sector === 'TRANSPORTATION', [config.sector]);

  const colors = useMemo(
    () => ({ ...energyColors, ...transportationColors }),
    [energyColors, transportationColors],
  );

  const fill = useMemo(
    () => FillLayer(isTransportation),
    [isTransportation],
  );
  const getTooltip = useCallback((event) => {
    let currYear = null;

    const section = {
      title: intl.formatMessage({ id: `common.scenarios.${config.scenarios[0]}` }),
      nodes: event.slice?.points.map((value) => {
        if (!currYear) currYear = value.data?.x;

        return {
          name: isTransportation && OIL_SUBGROUP.includes(value.serieId)
            ? intl.formatMessage({ id: `common.sources.transportation.${value.serieId}` })
            : intl.formatMessage({ id: `common.sources.energy.${value.serieId}` }),
          value: value.data?.y,
          color: value.serieColor,
          mask: (isTransportation && OIL_SUBGROUP.includes(value.serieId)) ? `url(#${value.serieId}-mask)` : undefined,
        };
      }),
      unit: intl.formatMessage({ id: `common.units.${config.unit}` }),
      totalLabel: intl.formatMessage({ id: 'common.total' }),
      hasPercentage: true,
    };

    return (
      <YearSliceTooltip
        sections={[section]}
        year={currYear?.toString()}
        isSliceTooltip
      />
    );
  }, [intl, config.scenarios, config.unit, isTransportation]);

  const processedData = useMemo(() => {
    const formattedData = formatLineData(data, 'source', unitConversion);
    return formattedData && config.sourceOrder
      .map(id => ((isTransportation && id === 'OIL') ? OIL_SUBGROUP : id)).flat()
      .map(source => formattedData.find(o => o.id === source)).filter(Boolean)
      .reverse();
  }, [data, config.sourceOrder, isTransportation, unitConversion]);

  const ticks = useMemo(() => {
    const values = (processedData || []).map(source => source.data);
    const sums = (values[0] || [])
      .map((_, i) => values.map(source => source[i].y).reduce((a, b) => a + b, 0));
    return getTicks(Math.max(...sums));
  }, [processedData]);

  if (!year) {
    return null;
  }

  if (!processedData?.length) {
    const noDataMessageId = config.sources.length === 0
      ? 'common.unavailableData.noSourceSelected'
      : 'common.unavailableData.default';
    return (
      <UnavailableDataMessage message={intl.formatMessage({ id: noDataMessageId })} />
    );
  }

  return (
    <div className={classes.chart}>
      <ResponsiveLine
        {...CHART_PROPS}
        data={processedData}
        layers={[HistoricalLayer, 'grid', 'axes', 'crosshair', 'lines', 'points', 'slices', 'areas', fill, ForecastLayer]}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: ticks[ticks.length - 1], stacked: true }}
        curve="cardinal"
        axisRight={{
          ...CHART_AXIS_PROPS,
          tickValues: ticks,
        }}
        axisBottom={{
          ...CHART_AXIS_PROPS,
          format: getYearLabel,
        }}
        colors={d => colors[d.id]}
        lineWidth={0}
        enablePoints={false}
        enableSlices="x"
        sliceTooltip={getTooltip}
        gridYValues={ticks}
        defs={CHART_PATTERNS}
        forecastStart={year.forecastStart}
      />
    </div>
  );
};

export default BySector;
