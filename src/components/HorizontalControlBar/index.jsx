// #region imports
import React, { useMemo, useEffect } from 'react';
import {
  makeStyles, createStyles,
  Grid, Typography, Button, Tooltip,
} from '@material-ui/core';

import useConfig from '../../hooks/useConfig';
import { CONFIG_LAYOUT, SECTOR_LAYOUT, UNIT_NAMES } from '../../constants';
import Hint from '../Hint';
// #endregion

const useStyles = makeStyles(theme => createStyles({
  root: {
    height: 40,
    padding: theme.spacing(0.5, 2),
    backgroundColor: '#F3EFEF',
    '& p': { fontWeight: 700 },
  },
  btnSector: {
    marginRight: theme.spacing(1),
    height: 32,
    minWidth: 'min-content',
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
  const { config, setConfig } = useConfig();
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
        <Hint />
      </Grid>
      {Object.keys(CONFIG_LAYOUT).map(selection => (
        <Grid item key={`config-origin-${selection}`}>
          <Tooltip title={CONFIG_LAYOUT[selection]?.name} classes={{ tooltip: classes.tooltip }}>
            <span>
              <Button
                variant={config.mainSelection === selection ? 'contained' : 'outlined'}
                color="primary"
                size="small"
                disabled={selection === 'oilProduction'}
                onClick={() => handleConfigUpdate('mainSelection', selection)}
                className={classes.btnSector}
              >
                {CONFIG_LAYOUT[selection]?.name}
              </Button>
            </span>
          </Tooltip>
        </Grid>
      ))}
    </>
  );

  const sectors = ['by-sector', 'demand'].includes(config.page) && (
    <>
      <Grid item>
        <Hint><Typography variant="body1" color="primary">SECTOR</Typography></Hint>
      </Grid>
      {Object.keys(SECTOR_LAYOUT).map((sector) => {
        const Icon = SECTOR_LAYOUT[sector]?.icon;
        return (
          <Grid item key={`config-sector-${sector}`}>
            <Tooltip title={SECTOR_LAYOUT[sector]?.name} classes={{ tooltip: classes.tooltip }}>
              <span>
                <Button
                  variant={config.sector === sector ? 'contained' : 'outlined'}
                  color="primary"
                  size="small"
                  onClick={() => handleConfigUpdate('sector', sector)}
                  className={classes.btnSector}
                >
                  {sector === 'total' ? 'Total Demand' : <Icon />}
                </Button>
              </span>
            </Tooltip>
          </Grid>
        );
      })}
    </>
  );

  const views = config.page === 'electricity' && (
    <>
      <Hint><Typography variant="body1" color="primary">VIEW BY</Typography></Hint>
      {['region', 'source'].map(view => (
        <Button
          key={`config-view-${view}`}
          variant={config.view === view ? 'contained' : 'outlined'}
          color="primary"
          size="small"
          onClick={() => handleConfigUpdate('view', view)}
        >
          {view}
        </Button>
      ))}
    </>
  );

  const units = (
    <>
      <span style={{ flexGrow: 1 }} />
      <Hint><Typography variant="body1" color="primary">UNIT</Typography></Hint>
      {layout.unit.map(unit => (
        <Button
          key={`config-unit-${unit}`}
          variant={config.unit === unit ? 'contained' : 'outlined'}
          color="primary"
          size="small"
          onClick={() => handleConfigUpdate('unit', unit)}
        >
          {UNIT_NAMES[unit]}
        </Button>
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
