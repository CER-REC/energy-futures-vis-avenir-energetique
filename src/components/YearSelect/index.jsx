import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { makeStyles, Grid, Typography, Button, Tooltip } from '@material-ui/core';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import { HintYearSelect } from '../Hint';

const useStyles = makeStyles({
  button: {
    height: 43,
    width: 43,
    '& h5': { fontWeight: 700 },
  },
  selected: {
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 'calc(100% + 4px)',
      left: -1,
      right: -1,
      height: 16,
      backgroundColor: '#F3EFEF',
    },
  },
});

const YearSelect = () => {
  const classes = useStyles();
  const intl = useIntl();

  const { yearIdIterations } = useAPI();
  const { config, configDispatch } = useConfig();

  const yearIds = useMemo(
    () => Object.keys(yearIdIterations).sort().reverse(),
    [yearIdIterations],
  );

  return (
    <Grid container alignItems="center" wrap="nowrap" spacing={1}>
      <Grid item style={{ marginLeft: 14 }}>
        <HintYearSelect>
          <Typography variant="h6" color="secondary">{intl.formatMessage({ id: 'components.yearSelect.name' })}</Typography>
        </HintYearSelect>
      </Grid>

      {yearIds.map(yearId => (
        <Grid item key={`year-select-option-${yearId}`}>
          <Tooltip
            title={(
              <Typography variant="caption" color="secondary">
                {intl.formatMessage({ id: `components.yearSelect.${yearId}.title` })}
              </Typography>
            )}
          >
            <Button
              variant="contained"
              color={config.yearId === yearId ? 'primary' : 'secondary'}
              size="small"
              onClick={() => configDispatch({ type: 'yearId/changed', payload: yearId })}
              className={`${classes.button} ${config.yearId === yearId ? classes.selected : ''}`.trim()}
            >
              {config.yearId === yearId ? (<Typography variant="h5">{yearId}</Typography>) : yearId}
            </Button>
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  );
};

export default YearSelect;
