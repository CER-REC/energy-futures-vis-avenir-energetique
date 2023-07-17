import React, { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { makeStyles, Grid, Typography, Button, Tooltip } from '@material-ui/core';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import { SCENARIO_COLOR } from '../../constants';
import analytics from '../../analytics';
import { HintScenarioSelect } from '../Hint';
import { IconCheckbox } from '../../icons';

const checkboxSize = 14;

const useStyles = makeStyles(theme => ({
  root: {
    ...theme.mixins.selectionContainer,
  },
  labelContainer: {
    ...theme.mixins.labelContainer,
  },
  button: { lineHeight: 'normal' },
  checkbox: {
    marginLeft: '0.2em',
    height: checkboxSize,
    width: checkboxSize,
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
    <Grid container alignItems="center" className={classes.root}>
      <Grid item className={classes.labelContainer}>
        <Typography variant="subtitle1">{intl.formatMessage({ id: 'components.scenarioSelect.name' })}</Typography>
      </Grid>
      <HintScenarioSelect />
      {scenarios.map(scenario => (
        <Grid item key={`config-scenario-${scenario}`}>
          <Tooltip title={getTooltip(scenario)}>
            <Button
              className={classes.button}
              variant={multiSelect || (config.scenarios.indexOf(scenario) > -1) ? 'contained' : 'outlined'}
              color="primary"
              size="small"
              onClick={() => handleScenarioSelect(scenario)}
              style={multiSelect ? {
                backgroundColor: SCENARIO_COLOR[scenario],
                borderColor: SCENARIO_COLOR[scenario],
              } : {}}
            >
              {intl.formatMessage({ id: `common.scenarios.${scenario}` })}
              {multiSelect && (
                <IconCheckbox
                  className={classes.checkbox}
                  checked={config.scenarios.indexOf(scenario) > -1}
                />
              )}
            </Button>
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  );
};

ScenarioSelect.propTypes = {
  multiSelect: PropTypes.bool.isRequired,
};

export default ScenarioSelect;
