import React, { useCallback, useMemo } from 'react';
import { ResponsiveStream } from '@nivo/stream';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { linearGradientDef } from '@nivo/core';
import ForecastBar from '../../components/ForecastBar';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';

const BySector = ({ data, year }) => {
  const intl = useIntl();
  const { sources: { energy: { colors } } } = useAPI();
  const { config } = useConfig();
  const preForecastPercentage = ((2020 - year.min) / (year.max - year.min)) * 100;

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

  const defs = Object.keys(data[0]).map((source, index) => (
    <linearGradient key={source} id={`gradient${index}`}>
      {/* Gradient starts to fade after forecast line */}
      <stop key='0' offset={`${preForecastPercentage}%`} stopColor={colors[keys[index]]} stopOpacity='1' />
      <stop key='50' offset={`${100 - preForecastPercentage}%`} stopColor={colors[keys[index]]} stopOpacity='0.6' />
      <stop key='95' offset='95%' stopColor={colors[keys[index]]} stopOpacity='0.4' />
    </linearGradient>
  ));

  return (
    <>
      <svg height={0}>
        <defs>
          {defs}
        </defs>
      </svg>
      <ForecastBar year={year} />
      <ResponsiveStream
        data={data}
        keys={keys}
        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
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
        curve="linear"
        offsetType="diverging"
        colors={d => colors[keys[d.index]]}
        fillOpacity={0.60}
        borderColor={{ theme: 'background' }}
        dotSize={8}
        dotColor={{ from: 'color' }}
        dotBorderWidth={2}
        dotBorderColor={{ from: 'color', modifiers: [['darker', 0.7]] }}
        animate
        motionStiffness={90}
        motionDamping={15}
        tooltipLabel={getTooltipLabel}
        // defs={[
        //   {
        //     id: 'gradient',
        //     type: 'linearGradient',
        //     colors: [
        //       { offset: 0, color: '#000', opacity: 0.1 },
        //       { offset: 100, color: 'inherit', opacity: 1 },
        //     ],
        //     // ...options,
        //   },
        //   // (<linearGradient id="gradient">
        //   //   {/* Gradient starts to fade after forecast line */}
        //   //   <stop key='0' offset="0%" stopColor="blue" stopOpacity='1' />
        //   //   <stop key='50' offset="50%" stopColor="blue" stopOpacity='0.6' />
        //   //   <stop key='95' offset='95%' stopColor="blue" stopOpacity='0.2' />
        //   //   </linearGradient>),
        // ]}
        fill={[
          { match: d => d.index === 0, id: 'gradient0' },
          { match: d => d.index === 1, id: 'gradient1' },
          { match: d => d.index === 2, id: 'gradient2' },
          { match: d => d.index === 3, id: 'gradient3' },
          { match: d => d.index === 4, id: 'gradient4' },

        ]}
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
