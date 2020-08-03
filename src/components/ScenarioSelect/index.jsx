import React, { useContext, useState, useEffect, useMemo } from 'react';
import {
  makeStyles, createStyles,
  Grid, Typography, Button, Tooltip,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { ConfigContext } from '../../containers/App/lazy';
import { CONFIG_REPRESENTATION } from '../../types';
import { SCENARIO_LAYOUT, SCENARIO_TOOPTIP } from '../../constants';


const ScenarioSelect = () => {
  const classes = useStyles();

  const { config, setConfig } = useContext(ConfigContext);

  /**
   * If the previous selected scenario is no longer available after the year change,
   * then auto-select the first scenario in the new list.
   */
  useEffect(() => {
    const scenarios = SCENARIO_LAYOUT[config.year] || SCENARIO_LAYOUT['default'];
    scenarios.indexOf(config.scenario) < 0 && handleConfigUpdate('scenario', scenarios[0]);
  }, [config.year]);

  /**
   * Memorize the current menu structure based on the config.
   */
  const layoutScenario = useMemo(() => SCENARIO_LAYOUT[config.year] || SCENARIO_LAYOUT['default'], [config.year]);

  /**
   * Update the config.
   */
  const handleConfigUpdate = (field, value) => setConfig({ ...config, [field]: value });

  return (
    <Grid container alignItems="center" wrap="nowrap" spacing={1} className={classes.root}>
      <Grid item>
        <Typography variant="h6" color="primary">Scenarios</Typography>
      </Grid>

      {layoutScenario.map(scenario => (
        <Grid item key={`config-scenario-${scenario}`}>
          <Tooltip title={SCENARIO_TOOPTIP[scenario]} classes={{ tooltip: classes.tooltip }}>
            <Button
              variant={config.scenario === scenario ? 'contained' : 'outlined'} color="primary" size="small" fullWidth
              onClick={() => handleConfigUpdate('scenario', scenario)}
            >
              {CONFIG_REPRESENTATION[scenario]}
            </Button>
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  );
};

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

export default ScenarioSelect;
