import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import {
  makeStyles, createStyles,
  Grid, Typography, Button,
} from '@material-ui/core';

import useAPI from '../../hooks/useAPI';
import { ConfigContext } from '../../utilities/configContext';
import ImgReport from '../../images/report-link.png';

const useStyles = makeStyles(theme => createStyles({
  root: {
    position: 'relative',
    '& > div:first-of-type': { marginRight: theme.spacing(2) },
  },
  title: {
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  btnContained: {
    height: 43,
    width: 43,
  },
  btnOutlined: {
    height: 43,
    width: 43,
    backgroundColor: '#F3EFEF',
    border: '1px solid #F3EFEF',
    '&:hover': {
      backgroundColor: '#F3EFEF',
      border: '1px solid #F3EFEF',
      boxShadow: theme.shadows[2],
    },
  },
  report: {
    position: 'absolute',
    top: '50%',
    right: 0,
    transform: 'translateY(-50%)',
    '& img': { height: 60 },
    '& span': {
      width: 50,
      margin: 2,
      lineHeight: 1,
      fontSize: 10,
      textAlign: 'right',
    },
  },
}));

const YearSelect = () => {
  const classes = useStyles();
  const { data: { yearIdIterations } } = useAPI();
  const { config, setConfig } = useContext(ConfigContext);

  /**
   * Update the config.
   */
  const handleConfigUpdate = useCallback(
    (field, value) => setConfig({ ...config, [field]: value }),
    [setConfig, config],
  );

  /**
   * If the previous selected scenario is no longer available after the year change,
   * then auto-select the first scenario in the new list.
   */
  useEffect(
    () => {
      const { scenarios } = yearIdIterations[config.year];
      if (scenarios.indexOf(config.scenario) < 0) {
        handleConfigUpdate('scenario', scenarios[0]);
      }
    },
    [yearIdIterations, config.year, config.scenario, handleConfigUpdate],
  );

  const yearNames = useMemo(
    () => Object.keys(yearIdIterations).sort().reverse(),
    [yearIdIterations],
  );

  return (
    <Grid container alignItems="center" spacing={1} className={classes.root}>
      <Grid item>
        <Typography variant="h5" color="primary" className={classes.title}>Energy Futures From</Typography>
      </Grid>

      {yearNames.map(year => (
        <Grid item key={`year-select-option-${year}`}>
          <Button
            variant={config.year === year ? 'contained' : 'outlined'}
            color="primary"
            size="small"
            onClick={() => handleConfigUpdate('year', year)}
            classes={{
              containedPrimary: classes.btnContained,
              outlinedPrimary: classes.btnOutlined,
            }}
          >
            {config.year === year ? (<Typography variant="h5">{year}</Typography>) : year}
          </Button>
        </Grid>
      ))}

      <Grid item className={classes.report}>
        <Grid container alignItems="flex-end" wrap="nowrap">
          <Typography variant="overline" color="secondary">read report</Typography>
          <img src={String(ImgReport).startsWith('/') ? ImgReport : `/${ImgReport}`} alt="read report" />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default YearSelect;
