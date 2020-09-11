import React, { useMemo } from 'react';
import { ResponsiveStream } from '@nivo/stream';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { SOURCE_NAME, SOURCE_COLOR } from '../../constants';
import useConfig from '../../hooks/useConfig';

const useStyles = makeStyles(theme => ({
  test: {
    borderLeft: '2px dashed lightgray',
    height: '625px',
    width: '490px',
    position: 'absolute',
    // left: '50%',
    marginLeft: '300px',
    top: '10',
  },
  innerDiv: {
    backgroundColor: 'lightgray',
  },

}));

const BySector = ({ data, year }) => {
  const { config } = useConfig();
  const classes = useStyles();

  const keys = useMemo(() => {
    const sources = new Set((data || []).map(entry => Object.keys(entry)).flat());
    return [...config.sourceOrder].reverse().map(s => SOURCE_NAME[s]).filter(s => sources.has(s));
  }, [data, config.sourceOrder]);

  if (!data || !year) {
    return null;
  }
  const forecastYear = 2020;

  const width = ((year.max - forecastYear) / (year.max - year.min)) * 100;
  const margin = ((forecastYear - year.min) / (year.max - year.min)) * 100;
  return (
    <>

      <div style={{
        width: 'calc(100% - 100px)',
        marginLeft: 50,
        position: 'relative',

      }}
      >
        <div
          className='test'
          style={{
            marginLeft: `${margin}%`,
            width: `${width}%`,
            borderLeft: '2px dashed lightgray',
            height: '624px',
            top: 10,
            position: 'absolute',
          }}
        >
          <div style={{ backgroundColor: 'lightgrey' }}>Forecast</div>
        </div>
      </div>
      {/* <div style={{ width: 'calc(100% - 100px - 16px)', marginLeft: (50 + 8) }}>
        <div style={{
          display: 'inline-block',
          width: '40%',
          height: 20,
          background: 'repeating-linear-gradient(-60deg, #EEE, #EEE 10px, transparent 10px, transparent 20px)',
        }}
        />
        <div style={{ display: 'inline-block', width: '60%', height: 20, backgroundColor: '#AAA' }} />
      </div> */}

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
        colors={d => SOURCE_COLOR[keys[d.index]]}
        fillOpacity={0.60}
        borderColor={{ theme: 'background' }}
        dotSize={8}
        dotColor={{ from: 'color' }}
        dotBorderWidth={2}
        dotBorderColor={{ from: 'color', modifiers: [['darker', 0.7]] }}
        animate
        motionStiffness={90}
        motionDamping={15}
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
