import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import { Typography, makeStyles } from '@material-ui/core';
import { SCENARIO_COLOR } from '../../constants';

const Scenarios = ({ data, year }) => {
  // FIXME: forecastYear will need to be dynamic eventually.
  const forecastYear = 2020;
  const width = ((year.max - forecastYear) / (year.max - year.min)) * 100;
  const margin = ((forecastYear - year.min) / (year.max - year.min)) * 100;

  const classes = makeStyles(theme => ({
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
    forecast: {
      backgroundColor: '#F3F2F2',
      paddingLeft: '5px',
    },
  }))();

  if (!data) {
    return null;
  }

  return (
    <>
      <div className={classes.outerContainer}>
        <div className={classes.innerContainer}>
          <div className={classes.forecast}>
            <Typography variant='body1' color='secondary'>Forecast</Typography>
          </div>
        </div>
      </div>
      <ResponsiveLine
        data={data}
        curve="cardinal"
        areaOpacity={0.15}
        enableArea
        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: 'auto', reverse: false }}
        colors={d => SCENARIO_COLOR[d.id] || '#AAA'}
        pointSize={8}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="y"
        pointLabelYOffset={-12}
        axisTop={null}
        axisLeft={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: 32,
          format: year => ((year % 5) ? '' : year),
        }}
        axisRight={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        enableLabel={false}
        animate
        motionStiffness={90}
        motionDamping={15}
        useMesh
      />
    </>
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
