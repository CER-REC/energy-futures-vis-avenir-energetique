import React, { useContext, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles, createStyles,
  Grid, Typography, Button, Tooltip,
} from '@material-ui/core';

import { ConfigContext } from '../../utilities/configContext';
import { CONFIG_REPRESENTATION } from '../../types';
import { SCENARIO_LAYOUT, SCENARIO_TOOPTIP } from '../../constants';

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

/**
 * TODO: replace it with
 * 1) real terms defined in the database, and;
 * 2) real colors from UI designers.
 */
const SCENARIO_COLOR = {
  technology: '#3692FA',
  hcp: '#0B3CB4',
  highPrice: '#6C5AEB',
  lowPrice: '#082346',
  constrained: '#333333',
  highLng: '#2B6762',
  noLng: '#3692FA',
};

const ScenarioSelect = ({ multiSelect }) => {
  const classes = useStyles();

  const { config, setConfig } = useContext(ConfigContext);

  /**
   * Update the config.scenario.
   */
  const handleScenarioUpdate = useCallback(
    scenario => setConfig({ ...config, scenario }),
    [config, setConfig],
  );

  /**
   * If the previous selected scenario is no longer available after the year change,
   * then auto-select the first scenario in the new list.
   */
  useEffect(
    () => {
      if (multiSelect) {
        return;
      }
      const scenarios = SCENARIO_LAYOUT[config.year] || SCENARIO_LAYOUT.default;
      if (config.scenario.length > 1 || scenarios.indexOf(config.scenario[0]) < 0) {
        handleScenarioUpdate([scenarios[0]]);
      }
    },
    [multiSelect, config.year, config.scenario, handleScenarioUpdate],
  );

  /**
   * When a scenario button is pressed.
   */
  const handleScenarioSelect = useCallback((scenario) => {
    if (!multiSelect) {
      handleScenarioUpdate([scenario]);
      return;
    }
    const updated = config.scenario.indexOf(scenario) > -1
      ? [...config.scenario].filter(s => s !== scenario)
      : [...config.scenario, scenario];
    handleScenarioUpdate(updated);
  }, [multiSelect, config.scenario, handleScenarioUpdate]);

  /**
   * Memorize the current menu structure based on the config.
   */
  const layoutScenario = useMemo(
    () => SCENARIO_LAYOUT[config.year] || SCENARIO_LAYOUT.default,
    [config.year],
  );

  return (
    <Grid container alignItems="center" wrap="nowrap" spacing={1} className={classes.root}>
      <Grid item>
        <Typography variant="h6" color="primary">Scenarios</Typography>
      </Grid>

      {layoutScenario.map(scenario => (
        <Grid item key={`config-scenario-${scenario}`}>
          <Tooltip title={SCENARIO_TOOPTIP[scenario]} classes={{ tooltip: classes.tooltip }}>
            <Button
              variant={config.scenario.indexOf(scenario) > -1 ? 'contained' : 'outlined'}
              color="primary"
              size="small"
              fullWidth
              onClick={() => handleScenarioSelect(scenario)}
              style={multiSelect && config.scenario.indexOf(scenario) > -1 ? {
                backgroundColor: SCENARIO_COLOR[scenario],
                borderColor: SCENARIO_COLOR[scenario],
              } : {}}
            >
              {CONFIG_REPRESENTATION[scenario]}
            </Button>
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  );
};

ScenarioSelect.propTypes = {
  multiSelect: PropTypes.bool,
};

ScenarioSelect.defaultProps = {
  multiSelect: false,
};

export default ScenarioSelect;
