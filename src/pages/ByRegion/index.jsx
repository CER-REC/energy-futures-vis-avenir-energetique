import React, { useEffect, useMemo } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';

const ByRegion = ({ data, year }) => {
  const { regions } = useAPI();
  const { config, setConfig } = useConfig();

  // FIXME: forecastYear will need to be dynamic eventually.
  const forecastYear = 2020;
  const width = ((year.max - forecastYear) / (year.max - year.min)) * 100;
  const margin = ((forecastYear - year.min) / (year.max - year.min)) * 100;

  const classes = makeStyles({
    outerContainer: {
      // The 130 is to offset the chart margin, and 32 is for the extra line space on either side.
      width: 'calc(100% - 130px - 32px)',
      marginLeft: 'calc(50px + 17px)',
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

  /**
   * A "hacky" but sufficient way to reselect all regions after
   * being redirected from other pages but none of the regions is currently selected.
   */
  useEffect(() => {
    if (config.page === 'by-region' && JSON.stringify(config.provinces || []) === '["ALL"]') {
      setConfig({ ...config, provinces: regions.order });
    }
  }, [config, setConfig, regions.order]);

  /**
   * Determine the region order shown in the stacked bar chart.
   */
  const keys = useMemo(() => [...config.provinceOrder].reverse(), [config.provinceOrder]);

  if (!data) {
    return null;
  }

  return (
    <>
      <div className={classes.outerContainer}>
        <div className={classes.innerContainer}>
          <div className={classes.foreCast}>
            <Typography variant='body1' color='secondary'>Forecast</Typography>
          </div>
        </div>
      </div>
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy="year"
        margin={{ top: 50, right: 80, bottom: 50, left: 50 }}
        padding={0.1}
        colors={d => regions.colors[d.id]}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisLeft={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: 32,
          format: yearLabel => ((yearLabel % 5) ? '' : yearLabel),
        }}
        axisRight={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        enableLabel={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        animate
        motionStiffness={90}
        motionDamping={15}
      />
    </>
  );
};

ByRegion.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  year: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number }),

};

ByRegion.defaultProps = {
  data: undefined,
  year: { min: 0, max: 0 },
};

export default ByRegion;
