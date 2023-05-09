import React, { useCallback, useMemo, useRef } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import convertHexToRGB from '../../utilities/convertHexToRGB';
import analytics from '../../analytics';
import VizTooltip from '../../components/VizTooltip';
import { getMaxTick } from '../../utilities/parseData';
import { CHART_AXIS_PROPS, CHART_PROPS } from '../../constants';
import NetBarLineLayer from '../../components/NetBarLineLayer';
import HistoricalLayer from '../../components/HistoricalLayer';
import ForecastLayer from '../../components/ForecastLayer';
import CandlestickLayer from '../../components/CandlestickLayer';
import getYearLabel from '../../utilities/getYearLabel';

const useStyles = makeStyles(theme => ({
  chart: {
    ...theme.mixins.chart,
  },
}));

const Emissions = ({ data, year }) => {
  const { sources: { greenhouseGas: sources } } = useAPI();
  const { config } = useConfig();
  const classes = useStyles();

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
    return (
      <VizTooltip
        nodes={[{ name, value: entry.value, color: entry.color }]}
        unit={config.unit}
      />
    );
  }, [config.page, config.unit]);

  const axis = useMemo(() => {
    const highest = data && Math.max(...data
      .map(seg => Object.values(seg).reduce((a, b) => a + (typeof b === 'string' ? 0 : b), 0)));
    return getMaxTick(highest);
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
        layers={[HistoricalLayer, 'grid', 'axes', 'bars', 'markers', CandlestickLayer, ForecastLayer, NetBarLineLayer]}
        padding={0.6}
        indexBy="year"
        maxValue={axis.highest}
        // TODO: Replace with value from axis calculation
        minValue={-200}
        colors={colors}
        axisBottom={{
          ...CHART_AXIS_PROPS,
          format: getYearLabel,
        }}
        axisRight={{
          ...CHART_AXIS_PROPS,
          tickValues: axis.ticks,
        }}
        tooltip={getTooltip}
        gridYValues={axis.ticks}
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
