import React, { useCallback, useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import ForecastBar from '../../components/ForecastBar';

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

  const backgroundLayer = yearProp => (args) => {
    // This number is used in multiple charts. Perhaps it should be passed as a prop.
    // or perhaps this whole gradient can be exported
    const preForecastPercentage = ((2020 - yearProp.min) / (yearProp.max - yearProp.min)) * 100;

    /*
    Generate the areas for lines in the chart.
    The slice and reverse part is taken directly from the way Nivo draws the areas,
    removing them affects the look of the chart, though I dont know why.
    */
    const areas = args.series
      .slice(0)
      .reverse()
      .map((line, index) => (
        <g key={line.id}>
          <defs>
            <linearGradient id={`line-${index}-gradient`}>
              {/* Gradient starts to fade after forecast line */}
              <stop offset={`${preForecastPercentage}%`} stopColor={line.color} stopOpacity='1' />
              <stop offset={`${100 - preForecastPercentage}%`} stopColor={line.color} stopOpacity='0.6' />
              <stop offset='95%' stopColor={line.color} stopOpacity='0.2' />
            </linearGradient>
          </defs>
          <path
            d={args.areaGenerator(line.data.map(d => d.position))}
            fill={`url(#line-${index}-gradient)`}
            style={{ mixBlendMode: 'multiply', pointerEvents: 'none' }}
            opacity={0.5}
          />
        </g>
      ));

    return (<>{areas}</>);
  };
  return (
    <>
      <ForecastBar year={year} />
      <ResponsiveLine
        data={data}
        layers={['grid', 'axes', 'areas', 'crosshair', 'lines', 'points', 'mesh', backgroundLayer(year)]}
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
