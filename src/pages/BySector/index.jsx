import React, { useCallback, useMemo, useRef } from 'react';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import analytics from '../../analytics';
import { CHART_PROPS, CHART_AXIS_PROPS, CHART_PATTERNS, OIL_SUBGROUP } from '../../constants';
import { getMaxTick } from '../../utilities/parseData';

import { fadeLayerBySector } from '../../components/FadeLayer';
import forecastLayer from '../../components/ForecastLayer';
import MaxTick from '../../components/MaxTick';
import VizTooltip from '../../components/VizTooltip';

const BySector = ({ data, year }) => {
  const intl = useIntl();
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
   * The fade-out effect over forecast years.
   */
  const fade = useMemo(
    () => fadeLayerBySector({ year, isTransportation }),
    [year, isTransportation],
  );

  /**
   * The forecast bar.
   */
  const forecast = useMemo(() => forecastLayer({ year, label: intl.formatMessage({ id: 'common.forecast' }) }), [year, intl]);

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
    return getMaxTick(Math.max(...sums));
  }, [data]);
  const axisFormat = useCallback(
    value => (Math.abs(value - Math.max(...axis.ticks)) < Number.EPSILON
      ? <MaxTick value={value} unit={config.unit} />
      : value),
    [axis.ticks, config.unit],
  );

  if (!data || !year) {
    return null;
  }

  return (
    <div style={{ height: 700 }}>
      <ResponsiveLine
        {...CHART_PROPS}
        data={orderedData}
        layers={['grid', 'axes', 'crosshair', 'lines', 'points', 'slices', 'areas', fade, forecast]}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: axis.highest, stacked: true }}
        curve="cardinal"
        axisRight={{
          ...CHART_AXIS_PROPS,
          tickValues: axis.ticks,
          format: axisFormat,
        }}
        axisBottom={{
          ...CHART_AXIS_PROPS,
          format: value => ((value % 5) ? '' : value),
        }}
        colors={d => colors[d.id]}
        lineWidth={0}
        enablePoints={false}
        enableSlices="x"
        sliceTooltip={getTooltip}
        gridYValues={axis.ticks}
        defs={CHART_PATTERNS}
      />
    </div>
  );
};

BySector.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  year: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number }),
};

BySector.defaultProps = {
  data: undefined,
  year: { min: 0, max: 0 },
};

export default BySector;
