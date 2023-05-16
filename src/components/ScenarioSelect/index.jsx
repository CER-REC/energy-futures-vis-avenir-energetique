import React, { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { makeStyles, Grid, Typography, Button, Tooltip } from '@material-ui/core';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import { SCENARIO_COLOR } from '../../constants';
import analytics from '../../analytics';
import { HintScenarioSelect } from '../Hint';
import { IconCaret } from '../../icons';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(0.5, 3, 0.5, 1),
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.5, 1),
    },
    '& p': { fontSize: 16 },
  },
  scenarioButton: {
    padding: '0 1.5em',
    boxShadow: '2px 2px 4px 0px #00000040',
    textTransform: 'unset',
  },
  scenarioLabel: {
    whiteSpace: 'nowrap',
  },
  descriptionContainer: {
    width: '100%',
    overflowY: 'auto',
    '& > p': {
      paddingBottom: '0.3em',
    },
  },
  minimizeButton: {
    borderRadius: '1em',
    padding: '0 1em',
    textTransform: 'unset',
  },
}));

const ScenarioSelect = ({ multiSelect, isMinimized, setIsMinimized }) => {
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
      {scenarios.map(scenario => (
        <Grid item key={`config-scenario-${scenario}`} style={{ lineHeight: '1em' }}>
          <Tooltip title={getTooltip(scenario)}>
            <Button
              className={classes.scenarioButton}
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
      <Grid item>
        <HintScenarioSelect />
      </Grid>
      <Grid item justify="flex-end" style={{ flexGrow: 1, display: 'flex' }}>
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          className={classes.minimizeButton}
          onClick={() => setIsMinimized(!isMinimized)}
        >
          { isMinimized ? intl.formatMessage({ id: 'components.scenarioSelect.readMore' }) : intl.formatMessage({ id: 'components.scenarioSelect.readLess' }) }
          <IconCaret style={{ padding: '6px', transform: isMinimized && 'rotate(180deg)' }} />
        </Button>
      </Grid>
      { !isMinimized && (
        <Grid item className={classes.descriptionContainer}>
          {
            scenarios.map(scenario => (
              <Grid container key={`selected-${scenario}`} wrap="nowrap">
                <Grid item className={classes.scenarioLabel}>
                  <Typography variant="body2" style={{ color: SCENARIO_COLOR[scenario], fontWeight: 'bold' }}>
                    {scenario}
                  </Typography>
                </Grid>
                <Grid item><Typography variant="body2">&nbsp;-&nbsp;</Typography></Grid>
                <Grid item>
                  <Typography variant="body2">
                    {intl.formatMessage({ id: `components.scenarioSelect.${scenario}.description.default` })}
                  </Typography>
                </Grid>
              </Grid>
            ))
          }
        </Grid>
      )}
    </Grid>
  );
};

ScenarioSelect.propTypes = {
  multiSelect: PropTypes.bool,
  isMinimized: PropTypes.func.isRequired,
  setIsMinimized: PropTypes.func.isRequired,
};

ScenarioSelect.defaultProps = {
  multiSelect: false,
};

export default ScenarioSelect;
