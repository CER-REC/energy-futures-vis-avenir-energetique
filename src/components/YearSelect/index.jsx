import React, { useMemo } from 'react';
import {
  makeStyles, createStyles,
  Grid, Typography, Button,
} from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import {
  SocialMediaIconTwitter, SocialMediaIconFacebook, SocialMediaIconLinkedIn,
} from './SocialMediaIcons';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import LinkButtonGroup from '../LinkButtonGroup';

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
    top: 0,
    right: 0,
    zIndex: 1,
  },
}));

const YearSelect = () => {
  const classes = useStyles();
  const { yearIdIterations } = useAPI();
  const { config, setConfig } = useConfig();

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
        <LinkButtonGroup
          labels={[
            { icon: <SocialMediaIconTwitter />, name: 'Twitter' },
            { icon: <SocialMediaIconLinkedIn />, name: 'LinkedIn' },
            { icon: <SocialMediaIconFacebook />, name: 'Facebook' },
            { icon: <LinkIcon />, name: 'Copy Link' },
            'download data',
          ]}
          accent="right"
        />
      </Grid>
    </Grid>
  );
};

export default YearSelect;
