// #region imports
import React, { useContext, useMemo, useEffect } from 'react';
import {
  makeStyles, createStyles,
  Grid, Typography, Button, Tooltip,
} from '@material-ui/core';

import { ConfigContext } from '../../utilities/configContext';
import { CONFIG_LAYOUT, SECTOR_LAYOUT } from '../../constants';
import { CONFIG_REPRESENTATION } from '../../types';
// #endregion

const useStyles = makeStyles(theme => createStyles({
  root: {
    height: 40,
    padding: theme.spacing(0.5, 2),
    backgroundColor: '#F3EFEF',
    '& p': {
      marginRight: theme.spacing(1),
      fontWeight: 700,
    },
  },
  btnSector: {
    marginRight: theme.spacing(1),
    height: 32,
    minWidth: 40,
    maxWidth: 60,
    '& > span': { lineHeight: 1 },
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

const HorizontalControlBar = () => {
  const classes = useStyles();
  const { config, setConfig } = useContext(ConfigContext);
  const layout = useMemo(() => CONFIG_LAYOUT[config.mainSelection], [config.mainSelection]);

  /**
   * If the current selected unit is no longer available under the new source,
   * then select the default unit.
   */
  useEffect(() => {
    if (layout.unit.indexOf(config.unit) === -1) {
      setConfig({ ...config, unit: layout.unit[0] });
    }
  }, [config, config.mainSelection, layout.unit, setConfig]);

  /**
   * Update the config.
   */
  const handleConfigUpdate = (field, value) => setConfig({ ...config, [field]: value });

  if (!layout) {
    return null;
  }

  const selections = ['by-region', 'scenarios'].includes(config.page) && (
    <>
      <Grid item>
        <Typography variant="body1" color="primary">SOURCE</Typography>
      </Grid>
      {Object.keys(CONFIG_LAYOUT).map((selection) => {
        const Icon = CONFIG_LAYOUT[selection]?.icon;
        return (
          <Grid item key={`config-origin-${selection}`}>
            <Tooltip title={CONFIG_LAYOUT[selection]?.name} classes={{ tooltip: classes.tooltip }}>
              <Button
                variant={config.mainSelection === selection ? 'contained' : 'outlined'}
                color="primary"
                size="small"
                onClick={() => handleConfigUpdate('mainSelection', selection)}
                className={classes.btnSector}
              >
                {selection === 'energyDemand' ? 'Total Demand' : <Icon />}
              </Button>
            </Tooltip>
          </Grid>
        );
      })}
    </>
  );

  const sectors = ['by-sector', 'demand'].includes(config.page) && (
    <>
      <Grid item>
        <Typography variant="body1" color="primary">SECTOR</Typography>
      </Grid>
      {Object.keys(SECTOR_LAYOUT).map((sector) => {
        const Icon = SECTOR_LAYOUT[sector]?.icon;
        return (
          <Grid item key={`config-sector-${sector}`}>
            <Tooltip title={SECTOR_LAYOUT[sector]?.name} classes={{ tooltip: classes.tooltip }}>
              <Button
                variant={config.sector === sector ? 'contained' : 'outlined'}
                color="primary"
                size="small"
                onClick={() => handleConfigUpdate('sector', sector)}
                className={classes.btnSector}
              >
                {sector === 'total' ? 'Total Demand' : <Icon />}
              </Button>
            </Tooltip>
          </Grid>
        );
      })}
    </>
  );

  const views = config.page === 'electricity' && (
    <>
      <Grid item>
        <Typography variant="body1" color="primary">VIEW BY</Typography>
      </Grid>
      {['region', 'source'].map(view => (
        <Grid item key={`config-view-${view}`}>
          <Button
            variant={config.view === view ? 'contained' : 'outlined'}
            color="primary"
            size="small"
            onClick={() => handleConfigUpdate('view', view)}
          >
            {view}
          </Button>
        </Grid>
      ))}
    </>
  );

  const units = (
    <>
      <Grid item style={{ marginLeft: 90 }}>
        <Typography variant="body1" color="primary">UNIT</Typography>
      </Grid>
      {layout.unit.map(unit => (
        <Grid item key={`config-unit-${unit}`}>
          <Button
            variant={config.unit === unit ? 'contained' : 'outlined'}
            color="primary"
            size="small"
            onClick={() => handleConfigUpdate('unit', unit)}
          >
            {CONFIG_REPRESENTATION[unit]}
          </Button>
        </Grid>
      ))}
    </>
  );

  return (
    <Grid container alignItems="center" wrap="nowrap" className={classes.root}>
      {selections}
      {sectors}
      {views}
      {units}
    </Grid>
  );
};

export default HorizontalControlBar;
