// #region imports
import React, { useContext, useMemo, useEffect, useState } from 'react';
import {
  makeStyles, createStyles,
  Grid, Typography, Fab, IconButton, Button,
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { ConfigContext } from '../../containers/App/lazy';
import { CONFIG_REPRESENTATION } from '../../types';
import { CONFIG_LAYOUT } from '../../constants';
// #endregion

const useStyles = makeStyles(theme => createStyles({
  root: props => ({
    width: props.width || '100%',
    '& > div': { textAlign: 'center' },
    marginLeft: '20px',
  }),
  title: { marginTop: theme.spacing(2) },
  icon: {
    height: 10,
    width: 10,
  },
  subtitle: { marginTop: theme.spacing(0.75) },
}));

const LowerHorizontalControl = () => {
  const classes = useStyles();
  const { config, setConfig } = useContext(ConfigContext);
  const layout = useMemo(() => CONFIG_LAYOUT[config.mainSelection], [config.mainSelection]);
  const handleConfigUpdate = (field, value) => () => setConfig({ ...config, [field]: value });
  const [testUnit, setUnit] = React.useState('petajoule');

  if (!layout) {
    return null;
  }
  /**
   * If the current selected unit is no longer available under the new source, then select the default unit.
   */
  useEffect(() => {
    layout.unit.indexOf(config.unit) === -1 && setConfig({ ...config, unit: layout.unit[0] });
  }, [config, config.mainSelection, layout.unit, setConfig]);

  // #region Buttons
  const demandButtons = Object.keys(CONFIG_LAYOUT).map((source) => {
    const Icon = CONFIG_REPRESENTATION[source].icon;
    return (
      // <Grid item key={`config-source-${source}`}>
      config.mainSelection === source ? (
        <Fab color="inherit" onClick={handleConfigUpdate('mainSelection', source)}><Icon fontSize="large" /></Fab>
      ) : (
        <IconButton color="inherit" onClick={handleConfigUpdate('mainSelection', source)} className={classes.icon}>
          <Icon fontSize="large" />
        </IconButton>
      )
      // </Grid>
    );
  });

  const handleUnitUpdate = (event, newUnit) => {
    console.log(config.unit, newUnit);
    // setUnit(newUnit);
    handleConfigUpdate('unit', newUnit);
  };

  // const unitButtons1 = layout.unit.map(unit => (
  //   <Grid item key={`config-unit-${unit}`}>
  //     <Button
  //       variant={config.unit === unit ? 'contained' : 'outlined'}
  //       color="inherit"
  //       onClick={handleConfigUpdate('unit', unit)} // ///////////TODO:
  //     >
  //       {CONFIG_REPRESENTATION[unit]}
  //     </Button>
  //   </Grid>
  // ));

  const unitButtons = layout.unit.map((unit) => {
    let styles;
    if (unit === config.unit) {
      styles = {
        borderRadius: 0,
        height: '30px',
        color: 'white',
        backgroundColor: '#898989',
        fontWeight: 'bold',
        border: '0px',
      };
    } else {
      styles = {
        borderRadius: 0,
        height: '30px',
        color: 'black',
        backgroundColor: '#ffffff',
        fontWeight: 'bold',
        border: '1px solid #898989',
      };
    }
    return (
      <ToggleButton
        value={unit}
        style={styles}
      >
        {CONFIG_REPRESENTATION[unit]}
      </ToggleButton>
    );
  });
  // #endregion

  return (
    // TODO: Add padding to the top.
    <Grid container alignItems="center" wrap='nowrap' spacing={5} className={classes.root}>
      {/* TODO: Change this to Typography */}
      <Typography style={{ marginRight: 8, minWidth: 70, width: 70, border: 'none', fontWeight: '500' }}>Choose Demand</Typography>
      {/* <Grid item key={`config-source-energyDemand`}> */}
      <Button style={{ borderRadius: 0, backgroundColor: '#898989', border: 'none', minWidth: '70px', width: '70px', color: 'white', fontWeight: '600' }} color="inherit" variant="outlined" onClick={handleConfigUpdate('mainSelection', 'energyDemand')}>
          Total Demand
      </Button>
      <Grid item><Typography variant="h6" color="inherit">OR</Typography></Grid>
      <Grid item><Typography variant="body1" color="inherit" style={{ minWidth: '60px', width: '60px', alignItems: 'center', fontWeight: '500', marginRight: '30px' }}>CHOOSE PRODUCTION</Typography></Grid>

      <Grid item style={{ padding: '10px' }}>{demandButtons[1]}</Grid>
      <Grid item style={{ padding: '10px' }}>{demandButtons[2]}</Grid>
      <Grid item style={{ padding: '10px' }}>{demandButtons[3]}</Grid>
      <Grid item><Typography variant="body1" color="inherit" style={{ minWidth: '60px', width: '60px', textAlign: 'center' }}>SELECT UNIT</Typography></Grid>
      <ToggleButtonGroup
        value={testUnit}
        onChange={handleUnitUpdate}
        exclusive
      >
        {unitButtons}
      </ToggleButtonGroup>
    </Grid>
  );
};

export default LowerHorizontalControl;
