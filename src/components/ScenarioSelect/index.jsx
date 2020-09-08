import React, { useCallback, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  makeStyles, createStyles,
  Grid, Typography, Button, Tooltip,
} from '@material-ui/core';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import { SCENARIO_COLOR } from '../../constants';

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

const ScenarioSelect = ({ multiSelect }) => {
  const classes = useStyles();
  const intl = useIntl();
  const { config, setConfig } = useConfig();
  const { yearIdIterations } = useAPI();
  const handleScenariosUpdate = useCallback(
    scenarios => setConfig({ ...config, scenarios }),
    [config, setConfig],
  );
  const scenarios = useMemo(() => {
    const reorderedScenarios = yearIdIterations[config.yearId]?.scenarios || [];
    // moving 'Evolving' to the front of the list
    if (reorderedScenarios.includes('Evolving')) {
      // eslint-disable-next-line no-nested-ternary
      reorderedScenarios.sort((a, b) => (a === 'Evolving' ? -1 : (b === 'Evolving' ? 1 : 0)));
    }
    return reorderedScenarios;
  }, [yearIdIterations, config.yearId]);

  /**
   * If the previous selected scenario is no longer available after the year change,
   * then auto-select the first scenario in the new list.
   */
  useEffect(
    () => {
      const validScenarios = config.scenarios.filter(s => scenarios.indexOf(s) !== -1);

      if (
        (multiSelect || (validScenarios.length === 1))
        && (config.scenarios.length === validScenarios.length)
      ) {
        if (!validScenarios.includes('Evolving') && scenarios.includes('Evolving')) {
          handleScenariosUpdate(['Evolving', ...multiSelect ? validScenarios : []]);
        }
        return;
      }

      if (multiSelect) {
        handleScenariosUpdate(validScenarios);
      } else if (validScenarios.length === 0) {
        handleScenariosUpdate([scenarios[0]]);
      } else {
        handleScenariosUpdate([validScenarios[0]]);
      }
    },
    [
      scenarios,
      multiSelect,
      yearIdIterations,
      config.yearId,
      config.scenarios,
      handleScenariosUpdate,
    ],
  );

  /**
   * When a scenario button is pressed.
   */
  const handleScenarioSelect = useCallback((scenario) => {
    if (!multiSelect) {
      handleScenariosUpdate([scenario]);
      return;
    }

    const updated = config.scenarios.indexOf(scenario) > -1
      ? [...config.scenarios].filter(configScenario => configScenario !== scenario)
      : [...config.scenarios, scenario];
    handleScenariosUpdate(updated);
  }, [multiSelect, config.scenarios, handleScenariosUpdate]);

  return (
    <Grid container alignItems="center" wrap="nowrap" spacing={1} className={classes.root}>
      <Grid item>
        <Typography variant="h6" color="primary">Scenarios</Typography>
      </Grid>

      {scenarios.map(scenario => (
        <Grid item key={`config-scenario-${scenario}`}>
          <Tooltip
            title={intl.formatMessage({ id: `components.scenarioSelect.${scenario}.description` })}
            classes={{ tooltip: classes.tooltip }}
          >
            <Button
              variant={config.scenarios.indexOf(scenario) > -1 ? 'contained' : 'outlined'}
              color="primary"
              size="small"
              fullWidth
              onClick={() => handleScenarioSelect(scenario)}
              style={multiSelect && config.scenarios.indexOf(scenario) > -1 ? {
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
