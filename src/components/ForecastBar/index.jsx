import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, createStyles, Typography } from '@material-ui/core';
import useConfig from '../../hooks/useConfig';

const useStyles = makeStyles(() => createStyles({
  outerContainer: ({ page }) => ({
    // 130px or 100px is to offset the chart margin
    width: page === 'by-region' ? 'calc(100% - 130px - 32px)' : 'calc(100% - 100px)',
    marginLeft: page === 'by-region' ? 'calc(50px + 17px)' : '50px',
    position: 'relative',
    pointerEvents: 'none',
  }),
  innerContainer: ({ year }) => ({
    marginLeft: `${((year.forecastStart - year.min) / (year.max - year.min)) * 100}%`,
    width: `${((year.max - year.forecastStart) / (year.max - year.min)) * 100}%`,
    borderLeft: '1px dashed black',
    height: '620px',
    position: 'absolute',
    zIndex: 1,
  }),
  foreCast: {
    backgroundImage: 'linear-gradient(to left, rgba(255,0,0,0), rgba(243, 242, 242, 1) 30%)',
    paddingLeft: '5px',
  },
}));

const ForecastBar = ({ year }) => {
  const { page } = useConfig().config;

  const classes = useStyles({ year, page });

  return (
    <div className={classes.outerContainer}>
      <div className={classes.innerContainer}>
        <div className={classes.foreCast}>
          {/* TODO: This will need to be replaced by a translated version. */}
          <Typography variant='body1' color='secondary'>Forecast</Typography>
        </div>
      </div>
    </div>
  );
};

ForecastBar.propTypes = {
  year: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number }).isRequired,
};

export default ForecastBar;
