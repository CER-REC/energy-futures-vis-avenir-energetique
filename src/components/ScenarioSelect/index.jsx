import React, { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { makeStyles, Grid, Typography, Button, Tooltip } from '@material-ui/core';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import { SCENARIO_COLOR } from '../../constants';
import analytics from '../../analytics';
import { HintScenarioSelect } from '../Hint';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0.5, 2),
    '& p': { fontWeight: 700 },
  },
}));

const ScenarioSelect = ({ multiSelect }) => {
  const classes = useStyles();
  const intl = useIntl();

  const { config, configDispatch } = useConfig();
  const { yearIdIterations } = useAPI();

  const handleScenariosUpdate = useCallback((scenarios) => {
    configDispatch({ type: 'scenarios/changed', payload: scenarios });
    analytics.reportFeature(config.page, 'scenarios', scenarios.map(s => s.toLowerCase()).join(','));
  }, [configDispatch, config.page]);

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

  /**
   * Prepare the tooltip text of a given scenario button.
   */
  const getTooltip = useCallback(scenario => intl.formatMessage({
    id: `components.scenarioSelect.${scenario}.tooltip.${config.yearId}`,
    defaultMessage: intl.formatMessage({
      id: `components.scenarioSelect.${scenario}.description.${config.yearId}`,
      defaultMessage: intl.formatMessage({ id: `components.scenarioSelect.${scenario}.description.default` }),
    }),
  }), [intl, config.yearId]);

  return (
    <Grid container alignItems="center" spacing={1} className={classes.root}>
      <Grid item>
        <HintScenarioSelect>
          <Typography variant="body1" color="secondary">{intl.formatMessage({ id: 'components.scenarioSelect.name' })}</Typography>
        </HintScenarioSelect>
      </Grid>

      {scenarios.map(scenario => (
        <Grid item key={`config-scenario-${scenario}`}>
          <Tooltip title={getTooltip(scenario)}>
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
              {intl.formatMessage({ id: `common.scenarios.${scenario}` })}
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
