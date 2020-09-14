import React, { useCallback, useMemo } from 'react';
import { ResponsiveStream } from '@nivo/stream';
import PropTypes from 'prop-types';
import { Typography, makeStyles } from '@material-ui/core';
import { useIntl } from 'react-intl';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';

const BySector = ({ data, year }) => {
  const intl = useIntl();
  const { sources: { energy: { colors } } } = useAPI();
  const { config } = useConfig();

  // FIXME: forecastYear will need to be dynamic eventually.
  const forecastYear = 2020;
  const width = ((year.max - forecastYear) / (year.max - year.min)) * 100;
  const margin = ((forecastYear - year.min) / (year.max - year.min)) * 100;

  const classes = makeStyles({
    outerContainer: {
      // The 100 is to offset the chart margin
      width: 'calc(100% - 100px)',
      marginLeft: '50px',
      position: 'relative',
    },
    innerContainer: {
      marginLeft: `${margin}%`,
      width: `${width}%`,
      borderLeft: '1px dashed black',
      height: '620px',
      position: 'absolute',
      zIndex: 1,
    },
    foreCast: {
      backgroundColor: '#F3F2F2',
      paddingLeft: '5px',
    },
  }))();

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
      <div className={classes.outerContainer}>
        <div className={classes.innerContainer}>
          <div className={classes.foreCast}>
            {/* TODO: This will need to be replaced by a translated version. */}
            <Typography variant='body1' color='secondary'>Forecast</Typography>
          </div>
        </div>
      </div>
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
