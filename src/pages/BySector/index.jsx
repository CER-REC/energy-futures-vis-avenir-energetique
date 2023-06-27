import React, { useCallback, useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { makeStyles } from '@material-ui/core';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import { CHART_PROPS, CHART_AXIS_PROPS, CHART_PATTERNS, OIL_SUBGROUP } from '../../constants';
import { getTicks } from '../../utilities/parseData';

import FillLayer from '../../components/FillLayer';
import ForecastLayer from '../../components/ForecastLayer';
import HistoricalLayer from '../../components/HistoricalLayer';
import getYearLabel from '../../utilities/getYearLabel';
import YearSliceTooltip from '../../components/YearSliceTooltip';

const useStyles = makeStyles(theme => ({
  chart: {
    ...theme.mixins.chart,
  },
}));

const BySector = ({ data, year }) => {
  const intl = useIntl();
  const classes = useStyles();
  const {
    sources: {
      energy: { colors: energyColors },
      transportation: { colors: transportationColors },
    },
  } = useAPI();
  const { config } = useConfig();

  /**
   * Determine whether or not 'transportation' is the current selected sector.
   */
  const isTransportation = useMemo(() => config.sector === 'TRANSPORTATION', [config.sector]);

  /**
   * Prepare the color palette, which is a combination of energy colors and transportation colors.
   */
  const colors = useMemo(
    () => ({ ...energyColors, ...transportationColors }),
    [energyColors, transportationColors],
  );

  const orderedData = useMemo(
    () => data && config.sourceOrder
      .map(id => ((isTransportation && id === 'OIL') ? OIL_SUBGROUP : id)).flat() // expand extra oil options
      .map(source => data.find(o => o.id === source)).filter(Boolean) // place sources in order
      .reverse(),
    [data, config.sourceOrder, isTransportation],
  );

  /**
   * Fill over forecast years.
   */
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

  /**
   * Calculate the max tick value on y-axis.
   */
  const ticks = useMemo(() => {
    const values = (data || []).map(source => source.data);
    const sums = (values[0] || [])
      .map((_, i) => values.map(source => source[i].y).reduce((a, b) => a + b, 0));
    return getTicks(Math.max(...sums));
  }, [data]);

  if (!data || !year) {
    return null;
  }

  return (
    <div className={classes.chart}>
      <ResponsiveLine
        {...CHART_PROPS}
        data={orderedData}
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

BySector.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  year: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
    forecastStart: PropTypes.number,
  }),
};

BySector.defaultProps = {
  data: undefined,
  year: {
    min: 0,
    max: 0,
    forecastStart: 0,
  },
};

export default BySector;
