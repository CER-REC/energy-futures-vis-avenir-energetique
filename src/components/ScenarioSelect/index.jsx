import React, { useCallback, useContext, useEffect } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
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

/**
 * TODO: replace it with
 * 1) real colors from UI designers.
 */
const SCENARIO_COLOR = {
  Technology: '#3692FA',
  'Higher Carbon Price': '#0B3CB4',
  'High Price': '#6C5AEB',
  'Low Price': '#082346',
  Constrained: '#333333',
  'High LNG': '#2B6762',
  'No LNG': '#3692FA',
};

const ScenarioSelect = ({ multiSelect }) => {
  const classes = useStyles();
  const intl = useIntl();
  const { config, setConfig } = useContext(ConfigContext);
  const { data: { yearIdIterations } } = useAPI();
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
      const { scenarios } = yearIdIterations[config.year];
      const validScenarios = config.scenario.filter(scenario => scenarios.indexOf(scenario) !== -1);

      if (
        (multiSelect || (validScenarios.length === 1))
        && (config.scenario.length === validScenarios.length)
      ) {
        return;
      }

      if (multiSelect) {
        handleScenarioUpdate(validScenarios);
      } else if (validScenarios.length === 0) {
        handleScenarioUpdate([scenarios[0]]);
      } else {
        handleScenarioUpdate([validScenarios[0]]);
      }
    },
    [multiSelect, yearIdIterations, config.year, config.scenario, handleScenarioUpdate],
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
              {intl.formatMessage({ id: `components.scenarioSelect.${scenario}.title` })}
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
