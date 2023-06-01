import React, { useCallback, useMemo, useRef } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { useIntl } from 'react-intl';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import convertHexToRGB from '../../utilities/convertHexToRGB';
import analytics from '../../analytics';
import { getTicks } from '../../utilities/parseData';
import { CHART_PROPS } from '../../constants';
import NetBarLineLayer from '../../components/NetBarLineLayer';
import HistoricalLayer from '../../components/HistoricalLayer';
import ForecastLayer from '../../components/ForecastLayer';
import getYearLabel from '../../utilities/getYearLabel';
import YearSliceTooltip from '../../components/YearSliceTooltip';

const useStyles = makeStyles(theme => ({
  chart: {
    ...theme.mixins.chart,
  },
}));

const Emissions = ({ data, year }) => {
  const { sources: { greenhouseGas: sources } } = useAPI();
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

  const timer = useRef(null);
  const getTooltip = useCallback((entry) => {
    // capture hover event and use a timer to avoid throttling
    const name = `${entry.id} - ${entry.indexValue}`;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => analytics.reportPoi(config.page, name), 500);

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
      unit: config.unit,
      totalLabel: intl.formatMessage({ id: 'common.netEmissions' }),
    };

    return (
      <YearSliceTooltip
        sections={[section]}
        year={entry.indexValue}
      />
    );
  }, [config.page, config.scenarios, config.unit, intl, sources.colors, sources.order]);

  const ticks = useMemo(() => {
    const highest = data && Math.max(...data
      .map(seg => Object.values(seg).reduce((a, b) => {
        if (typeof b === 'string' || b < 0) return a;
        return a + b;
      }, 0)));
    const lowest = data && Math.min(...data
      .map(seg => Object.values(seg).reduce((a, b) => {
        if (typeof b === 'string' || b > 0) return a;
        return a + b;
      }, 0)));

    return getTicks(highest, lowest);
  }, [data]);

  const xAxisGridLines = useMemo(() => {
    if (!data) return [];
    const allYears = data.map(entry => entry.year);
    return allYears.filter(value => getYearLabel(value) !== '');
  }, [data]);

  if (!data?.length) {
    return null;
  }

  return (
    <div className={classes.chart}>
      <ResponsiveBar
        {...CHART_PROPS}
        data={data}
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
        markers={[{
          axis: 'y',
          value: 0,
          lineStyle: { stroke: 'rgba(0,0,0,1)', strokeWidth: 3 },
        }]}
      />
    </div>
  );
};

Emissions.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  year: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
    forecastStart: PropTypes.number,
  }),
};

Emissions.defaultProps = {
  data: undefined,
  year: {
    min: 0,
    max: 0,
    forecastStart: 0,
  },
};

export default Emissions;
