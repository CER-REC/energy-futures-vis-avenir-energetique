import React, { useCallback, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Grid, Typography, Button, Tooltip } from '@material-ui/core';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import { SCENARIO_COLOR } from '../../constants';
import { HintScenarioSelect } from '../Hint';

const ScenarioSelect = ({ multiSelect }) => {
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

  /**
   * Prepare the tooltip text of a given scenario button.
   */
  const getTooltip = useCallback(scenario => intl.formatMessage({
    id: `components.scenarioSelect.${scenario}.description.${config.yearId}`,
    defaultMessage: intl.formatMessage({ id: `components.scenarioSelect.${scenario}.description.default` }),
  }), [intl, config.yearId]);

  return (
    <Grid container alignItems="center" wrap="nowrap" spacing={1}>
      <Grid item>
        <HintScenarioSelect>
          <Typography variant="h6" color="primary">{intl.formatMessage({ id: 'components.scenarioSelect.name' })}</Typography>
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
