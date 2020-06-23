import React, { useContext, useEffect, useMemo } from 'react';
import {
  makeStyles, createStyles,
  Grid, Typography, Fab, Button, IconButton,
} from '@material-ui/core';

import { ConfigContext } from '../../containers/App/lazy';
import { CONFIG_REPRESENTATION } from '../../types';


const CONFIG_LAYOUT = {
  energyDemand: {
    unit: ['petajoules', 'kilobarrelEquivalents'],
    year: ['2019', '2018', '2017', '2016'],
    scenario: ['reference', 'technology', 'hcp'],
  },
  electricityGeneration: {
    unit: ['petajoules', 'gigawattHours', 'kilobarrelEquivalents'],
    year: ['2019', '2018', '2017', '2016'],
    scenario: ['reference', 'technology', 'hcp'],
  },
  oilProduction: {
    unit: ['kilobarrels', 'thousandCubicMetres'],
    year: ['2019', '2018', '2017', '2016'],
    scenario: ['reference', 'technology', 'hcp'],
  },
  gasProduction: {
    unit: ['cubicFeet', 'millionCubicMetres'],
    year: ['2019', '2018', '2017', '2016'],
    scenario: ['reference', 'technology', 'hcp'],
  },
};

const Control = ({ width }) => {
  const classes = useStyles({ width });

  const { config, setConfig } = useContext(ConfigContext);

  /**
   * Memorize the current menu structure based on the config.
   */
  const layout = useMemo(() => CONFIG_LAYOUT[config.mainSelection], [config.mainSelection]);

  /**
   * If the current selected unit is no longer available under the new source, then select the default unit.
   */
  useEffect(() => {
    layout.unit.indexOf(config.unit) === -1 && setConfig({ ...config, unit: layout.unit[0] });
  }, [config.mainSelection]);

  if (!layout) {
    return null;
  }

  /**
   * Update the config.
   */
  const handleConfigUpdate = (field, value) => () => setConfig({ ...config, [field]: value });

  return (
    <Grid container spacing={1} className={classes.root}>
      {Object.keys(CONFIG_LAYOUT).map(source => {
        const Icon = CONFIG_REPRESENTATION[source].icon;
        return (
          <Grid item key={`config-source-${source}`} xs={6}>
            {config.mainSelection === source ? (
              <Fab color="primary" onClick={handleConfigUpdate('mainSelection', source)}><Icon fontSize="large" /></Fab>
            ) : (
              <IconButton color="primary" onClick={handleConfigUpdate('mainSelection', source)} className={classes.icon}>
                <Icon fontSize="large" />
              </IconButton>
            )}
            <Typography variant="caption" component="div" className={classes.subtitle}>
              {CONFIG_REPRESENTATION[source].name}
            </Typography>
          </Grid>
        );
      })}

      <Grid item xs={12} className={classes.title}>
        <Typography variant="body1">SELECT UNIT</Typography>
      </Grid>
      {layout.unit.map(unit => (
        <Grid item key={`config-unit-${unit}`} xs={12}>
          <Button
            variant={config.unit === unit ? 'contained' : 'outlined'} color="primary" fullWidth
            onClick={handleConfigUpdate('unit', unit)}
          >
            {CONFIG_REPRESENTATION[unit]}
          </Button>
        </Grid>
      ))}

      <Grid item xs={12} className={classes.title}>
        <Typography variant="body1">ENERGY FUTURES</Typography>
      </Grid>
      {layout.year.map(year => (
        <Grid item key={`config-year-${year}`} xs={12}>
          <Button
            variant={config.year === year ? 'contained' : 'outlined'} color="primary" fullWidth
            onClick={handleConfigUpdate('year', year)}
          >
            {year}
          </Button>
        </Grid>
      ))}

      <Grid item xs={12} className={classes.title}>
        <Typography variant="body1">SELECT SCENARIO</Typography>
      </Grid>
      {layout.scenario.map(scenario => (
        <Grid item key={`config-scenario-${scenario}`} xs={12}>
          <Button
            variant={config.scenario === scenario ? 'contained' : 'outlined'} color="primary" fullWidth
            onClick={handleConfigUpdate('scenario', scenario)}
          >
            {CONFIG_REPRESENTATION[scenario]}
          </Button>
        </Grid>
      ))}

    </Grid>
  );
};

const useStyles = makeStyles(theme => createStyles({
  root: props => ({
    width: props.width || '100%',
    '& > div': { textAlign: 'center' },
  }),
  title: { marginTop: theme.spacing(2) },
  icon: {
    height: 56,
    width: 56,
  },
  subtitle: { marginTop: theme.spacing(.75) },
}));

export default Control;
