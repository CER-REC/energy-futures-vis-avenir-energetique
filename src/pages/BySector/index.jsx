import React, { useCallback, useMemo, useRef } from 'react';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { makeStyles } from '@material-ui/core';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import analytics from '../../analytics';
import { CHART_PROPS, CHART_AXIS_PROPS, CHART_PATTERNS, OIL_SUBGROUP } from '../../constants';
import { getTicks } from '../../utilities/parseData';

import { fillLayerBySector } from '../../components/FillLayer';
import ForecastLayer from '../../components/ForecastLayer';
import VizTooltip from '../../components/VizTooltip';
import HistoricalLayer from '../../components/HistoricalLayer';
import getYearLabel from '../../utilities/getYearLabel';

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
    () => fillLayerBySector({ year, isTransportation }),
    [year, isTransportation],
  );

  /**
   * Format tooltip.
   */
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
          translation: isTransportation && OIL_SUBGROUP.includes(value.serieId)
            ? intl.formatMessage({ id: `common.sources.transportation.${value.serieId}` })
            : intl.formatMessage({ id: `common.sources.energy.${value.serieId}` }),
          value: value.data?.y,
          color: value.serieColor,
          mask: isTransportation && OIL_SUBGROUP.includes(value.serieId) && `url(#${value.serieId}-mask)`,
        }))}
        unit={config.unit}
        paper
      />
    );
  }, [intl, isTransportation, config.unit, config.page, year]);

  /**
   * Calculate the max tick value on y-axis.
   */
  const axis = useMemo(() => {
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
        yScale={{ type: 'linear', min: 0, max: axis.max, stacked: true }}
        curve="cardinal"
        axisRight={{
          ...CHART_AXIS_PROPS,
          tickValues: axis.ticks,
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
        gridYValues={axis.ticks}
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
