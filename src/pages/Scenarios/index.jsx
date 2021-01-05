import React, { useCallback, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import useConfig from '../../hooks/useConfig';
import analytics from '../../analytics';

import { CHART_PROPS, CHART_AXIS_PROPS, SCENARIO_COLOR } from '../../constants';
import { getMaxTick } from '../../utilities/parseData';
import { fadeLayerScenario } from '../../components/FadeLayer';
import forecastLayer from '../../components/ForecastLayer';
import VizTooltip from '../../components/VizTooltip';
import MaxTick from '../../components/MaxTick';

/**
 * Generate a custom dotted line layer for rendering the default scenario.
 */
export const dottedLayer = scenarioYear => args => args.points
  .filter(point => point.serieId === (scenarioYear === '2020' ? 'Evolving' : 'Reference'))
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

const Scenarios = ({ data, year }) => {
  const intl = useIntl();
  const { config } = useConfig();

  /**
   * The dotted line layer that represents the default scenario.
   */
  const dots = useMemo(() => dottedLayer(config.yearId), [config.yearId]);

  /**
   * The fade-out effect over forecast years.
   */
  const fade = useMemo(() => fadeLayerScenario({ year }), [year]);

  /**
   * The forecast bar.
   */
  const forecast = useMemo(() => forecastLayer({ year, label: intl.formatMessage({ id: 'common.forecast' }) }), [year, intl]);

  /**
   * Calculate the max tick value on y-axis.
   */
  const axis = useMemo(() => {
    const values = (data || []).map(source => source.data);
    const sums = (values[0] || [])
      .map((_, i) => Math.max(...values.map(source => source[i].y)));
    return getMaxTick(Math.max(...sums), true);
  }, [data]);
  const axisFormat = useCallback(
    value => (Math.abs(value - Math.max(...axis.ticks)) < Number.EPSILON
      ? <MaxTick value={value} unit={config.unit} />
      : value),
    [axis.ticks, config.unit],
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
          translation: intl.formatMessage({ id: `common.scenarios.${value.serieId}` }),
          value: value.data?.y,
          color: value.serieColor,
        }))}
        unit={config.unit}
        paper
        showTotal={false}
        showPercentage={false}
      />
    );
  }, [timer, intl, config.unit, config.page, year]);

  if (!data) {
    return null;
  }

  return (
    <div style={{ height: 700 }}>
      <ResponsiveLine
        {...CHART_PROPS}
        data={data}
        enableArea
        enablePoints={false}
        layers={['grid', 'axes', 'areas', 'crosshair', 'points', 'slices', fade, 'lines', forecast, dots]}
        curve="cardinal"
        areaOpacity={0.15}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: axis.highest, reverse: false }}
        colors={d => SCENARIO_COLOR[d.id] || '#AAA'}
        pointSize={8}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="y"
        pointLabelYOffset={-12}
        axisBottom={{
          ...CHART_AXIS_PROPS,
          format: yearLabel => ((yearLabel % 5) ? '' : yearLabel),
        }}
        axisRight={{
          ...CHART_AXIS_PROPS,
          tickValues: axis.ticks,
          format: axisFormat,
        }}
        enableSlices="x"
        sliceTooltip={getTooltip}
        gridYValues={axis.ticks}
      />
    </div>
  );
};

Scenarios.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  year: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number }),
};

Scenarios.defaultProps = {
  data: undefined,
  year: { min: 0, max: 0 },
};

export default Scenarios;
