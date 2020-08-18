import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import {
  makeStyles, createStyles,
  Grid, Typography, Button, Tooltip,
} from '@material-ui/core';

import useAPI from '../../hooks/useAPI';
import { ConfigContext } from '../../utilities/configContext';

const useStyles = makeStyles(theme => createStyles({
  root: {
    '& > div:first-of-type': { marginRight: theme.spacing(2) },
  },
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.secondary.main,
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: 0,
  },
}));

const ScenarioSelect = () => {
  const classes = useStyles();
  const intl = useIntl();
  const { config, setConfig } = useContext(ConfigContext);
  const { data: { yearIdIterations } } = useAPI();
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
    [yearIdIterations, config.year, config.scenario, handleConfigUpdate, setConfig],
  );

  return (
    <Grid container alignItems="center" wrap="nowrap" spacing={1} className={classes.root}>
      <Grid item>
        <Typography variant="h6" color="primary">Scenarios</Typography>
      </Grid>

      {yearIdIterations[config.year].scenarios.map(scenario => (
        <Grid item key={`config-scenario-${scenario}`}>
          <Tooltip
            title={intl.formatMessage({ id: `components.scenarioSelect.${scenario}.description` })}
            classes={{ tooltip: classes.tooltip }}
          >
            <Button
              variant={config.scenario === scenario ? 'contained' : 'outlined'}
              color="primary"
              size="small"
              fullWidth
              onClick={() => handleConfigUpdate('scenario', scenario)}
            >
              {intl.formatMessage({ id: `components.scenarioSelect.${scenario}.title` })}
            </Button>
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  );
};

export default ScenarioSelect;
