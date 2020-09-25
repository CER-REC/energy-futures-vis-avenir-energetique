import React, { useCallback, useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import ForecastBar from '../../components/ForecastBar';
import fadeLayer from '../../components/FadeLayer/index';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';

const BySector = ({ data, year }) => {
  const intl = useIntl();
  const { sources: { energy: { colors } } } = useAPI();
  const { config } = useConfig();

  const keys = useMemo(() => {
    const sources = new Set((data || []).map(entry => Object.keys(entry)).flat());
    return [...config.sourceOrder].reverse().filter(s => sources.has(s));
  }, [data, config.sourceOrder]);

  const getTooltipLabel = useCallback(
    dataItem => intl.formatMessage({ id: `common.sources.energy.${dataItem.id}` }).toUpperCase(),
    [intl],
  );

  if (!data || !year) {
    return null;
  }

  return (
    <>
      <ForecastBar year={year} />
      <ResponsiveLine
        data={data}
        layers={['grid', 'axes', 'areas', 'crosshair', 'lines', 'points', 'mesh', fadeLayer(year)]}
        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
        keys={keys}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
        curve="cardinal"
        axisTop={null}
        axisRight={{
          orient: 'right',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: value => ((value % 5) ? '' : value + year.min),
        }}
        axisLeft={null}
        colors={d => colors[d.id]}
        lineWidth={0}
        enablePoints={false}
        tooltipLabel={getTooltipLabel}
        useMesh
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
