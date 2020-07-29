// #region imports
import React, { useContext, useMemo, useEffect } from 'react';
import {
  makeStyles, createStyles,
  Grid, Typography, Fab, IconButton, Button,
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
// eslint-disable-next-line import/no-cycle
import { ConfigContext } from '../../containers/App/lazy';
import { CONFIG_REPRESENTATION } from '../../types';
import { CONFIG_LAYOUT } from '../../constants';
// #endregion

const useStyles = makeStyles(theme => createStyles({
  root: props => ({
    width: props.width || '100%',
    '& > div': { textAlign: 'center' },
    marginLeft: '20px',
    paddingTop: '12px',
  }),
  productionButton: {
    height: 10,
    width: 10,
  },
  subtitle: {
    marginTop: theme.spacing(0.75),
  },
  totalDemandButton: {
    borderRadius: 0,
    backgroundColor: '#e0e0e0',
    border: 'none',
    minWidth: '70px',
    width: '70px',
    color: '#696985',
    fontWeight: '600',
  },
  chooseProdLabel: {
    minWidth: '60px',
    width: '60px',
    alignItems: 'center',
    fontWeight: '500',
    marginRight: '30px',
  },
  selectUnitLabel: {
    minWidth: '60px',
    width: '60px',
    textAlign: 'center',
  },
  chooseDemandLabel: {
    marginRight: 8,
    minWidth: 70,
    width: 70,
    border: 'none',
    fontWeight: '500',
  },
  unitButtonSelected: {
    borderRadius: 0,
    height: '30px',
    color: 'white',
    backgroundColor: '#898989',
    fontWeight: 'bold',
    border: '0px',
  },
  unitButtonUnselected: {
    borderRadius: 0,
    height: '30px',
    color: 'black',
    backgroundColor: '#ffffff',
    fontWeight: 'bold',
    border: '1px solid #898989',
  },
}));

const HorizontalControlBar = () => {
  const classes = useStyles();
  const { config, setConfig } = useContext(ConfigContext);
  const layout = useMemo(() => CONFIG_LAYOUT[config.mainSelection], [config.mainSelection]);
  const handleConfigUpdate = (field, value) => () => setConfig({ ...config, [field]: value });

  /**
   * If the current selected unit is no longer available under the new source,
   * then select the default unit.
   */
  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    layout.unit.indexOf(config.unit) === -1 && setConfig({ ...config, unit: layout.unit[0] });
  }, [config, config.mainSelection, layout.unit, setConfig]);

  if (!layout) {
    return null;
  }
  // #region Buttons
  const demandButtons = Object.keys(CONFIG_LAYOUT).map((source) => {
    const Icon = CONFIG_REPRESENTATION[source].icon;
    return (
      config.mainSelection === source ? (
        <Fab color="inherit" onClick={handleConfigUpdate('mainSelection', source)}><Icon fontSize="large" /></Fab>
      ) : (
        <IconButton color="inherit" onClick={handleConfigUpdate('mainSelection', source)} className={classes.productionButton}>
          <Icon fontSize="large" />
        </IconButton>
      )
    );
  });

  const handleUnitUpdate = (event, newUnit) => {
    handleConfigUpdate('unit', newUnit);
  };

  const unitButtons = layout.unit.map((unit) => {
    const styles = (unit === config.unit)
      ? classes.unitButtonSelected
      : classes.unitButtonUnselected;
    return (
      <ToggleButton
        value={unit}
        className={styles}
        key={`${unit}-button`}
      >
        {CONFIG_REPRESENTATION[unit]}
      </ToggleButton>
    );
  });
  // #endregion

  return (
    <Grid container alignItems="center" wrap='nowrap' spacing={5} className={classes.root}>
      <Typography className={classes.chooseDemandLabel}>CHOOSE DEMAND</Typography>
      <Button
        className={classes.totalDemandButton}
        onClick={handleConfigUpdate('mainSelection', 'energyDemand')}
      >TOTAL DEMAND
      </Button>
      <Grid item><Typography variant="body1" style={{ fontSize: 25 }}>OR</Typography></Grid>
      <Grid item><Typography variant="body1" className={classes.chooseProdLabel}>CHOOSE PRODUCTION</Typography></Grid>

      <Grid item>{demandButtons[1]}</Grid>
      <Grid item>{demandButtons[2]}</Grid>
      <Grid item>{demandButtons[3]}</Grid>
      <Grid item>
        <Typography variant="body1" className={classes.selectUnitLabel}>SELECT UNIT</Typography>
      </Grid>
      <ToggleButtonGroup
        value={config.unit}
        onChange={handleUnitUpdate}
        exclusive
      >
        {unitButtons}
      </ToggleButtonGroup>
    </Grid>
  );
};

export default HorizontalControlBar;
