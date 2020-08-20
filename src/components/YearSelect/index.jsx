import React, { useContext, useMemo } from 'react';
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

  const yearIds = useMemo(
    () => Object.keys(yearIdIterations).sort().reverse(),
    [yearIdIterations],
  );

  return (
    <Grid container alignItems="center" spacing={1} className={classes.root}>
      <Grid item>
        <Typography variant="h5" color="primary" className={classes.title}>Energy Futures From</Typography>
      </Grid>

      {yearIds.map(yearId => (
        <Grid item key={`year-select-option-${yearId}`}>
          <Button
            variant={config.yearId === yearId ? 'contained' : 'outlined'}
            color="primary"
            size="small"
            onClick={() => setConfig({ ...config, yearId })}
            classes={{
              containedPrimary: classes.btnContained,
              outlinedPrimary: classes.btnOutlined,
            }}
          >
            {config.yearId === yearId ? (<Typography variant="h5">{yearId}</Typography>) : yearId}
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
