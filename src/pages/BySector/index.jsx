import React, { useCallback, useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import ForecastBar from '../../components/ForecastBar';
import fadeLayer from '../../components/FadeLayer';
import MaxTick from '../../components/MaxTick';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import { CHART_PROPS, CHART_AXIS_PROPS } from '../../constants';
import { getMaxTick } from '../../utilities/parseData';

const BySector = ({ data, year }) => {
  const intl = useIntl();
  const { sources: { energy: { colors } } } = useAPI();
  const { config } = useConfig();

  const orderedData = useMemo(
    () => data && config.sourceOrder
      .map(source => data.find(o => o.id === source))
      .filter(Boolean)
      .reverse(),
    [config.sourceOrder, data],
  );

  /**
   * The fade-out effect over forecast years.
   */
  const fade = useMemo(() => fadeLayer(year), [year]);

  /**
   * Format tooltip labels.
   */
  const getTooltipLabel = useCallback(
    dataItem => intl.formatMessage({ id: `common.sources.energy.${dataItem.id}` }).toUpperCase(),
    [intl],
  );

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
    <>
      <ForecastBar year={year} />
      <ResponsiveLine
        {...CHART_PROPS}
        data={orderedData}
        layers={['grid', 'axes', 'areas', 'crosshair', 'lines', 'points', 'mesh', fade]}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: axis.highest, stacked: true, reverse: false }}
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
        tooltipLabel={getTooltipLabel}
        useMesh
        gridYValues={axis.ticks}
      />
    </>
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
