import React, { useMemo } from 'react';
import {
  makeStyles, createStyles,
  Grid, Typography, Button,
} from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import EmailIcon from '@material-ui/icons/Email';
import {
  IconTwitter, IconFacebook, IconLinkedIn,
} from '../../icons';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import LinkButtonGroup from '../LinkButtonGroup';
import { HintYearSelect } from '../Hint';

const useStyles = makeStyles(theme => createStyles({
  root: {
    position: 'relative',
    '& > div:first-of-type': { marginRight: theme.spacing(2) },
  },
  title: {
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  button: {
    height: 43,
    width: 43,
    '& h5': { fontWeight: 700 },
  },
  report: {
    position: 'absolute',
    top: 0,
    right: 0,
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
        <HintYearSelect>
          <Typography variant="h5" color="primary" className={classes.title}>
            Canada&apos;s Energy Future
          </Typography>
        </HintYearSelect>
      </Grid>

      {yearIds.map(yearId => (
        <Grid item key={`year-select-option-${yearId}`}>
          <Button
            variant="contained"
            color={config.yearId === yearId ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setConfig({ ...config, yearId })}
            className={classes.button}
          >
            {config.yearId === yearId ? (<Typography variant="h5">{yearId}</Typography>) : yearId}
          </Button>
        </Grid>
      ))}

      <Grid item className={classes.report}>
        <LinkButtonGroup
          labels={[
            [
              { name: 'download data' },
            ], [
              { icon: <LinkIcon />, name: 'Copy Link', content: () => {} },
              { icon: <IconLinkedIn />, name: 'LinkedIn', content: () => {} },
              { icon: <IconFacebook />, name: 'Facebook', content: () => {} },
              { icon: <IconTwitter />, name: 'Twitter', content: () => {} },
              { icon: <EmailIcon />, name: 'Email', content: () => {} },
            ],
          ]}
          accent="right"
        />
      </Grid>
    </Grid>
  );
};

export default YearSelect;
