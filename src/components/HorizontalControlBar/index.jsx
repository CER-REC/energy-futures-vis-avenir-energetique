// #region imports
import React, { useContext, useMemo, useEffect } from 'react';
import {
  makeStyles, createStyles,
  Grid, Typography, Button,
} from '@material-ui/core';

import { ConfigContext } from '../../utilities/configContext';
import { CONFIG_REPRESENTATION } from '../../types';
import { CONFIG_LAYOUT } from '../../constants';
// #endregion

const useStyles = makeStyles(theme => createStyles({
  root: {
    padding: theme.spacing(0.5, 2),
    backgroundColor: '#F3EFEF',
    '& p': {
      marginRight: theme.spacing(1),
      fontWeight: 700,
    },
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
    // eslint-disable-next-line no-unused-expressions
    layout.unit.indexOf(config.unit) === -1 && setConfig({ ...config, unit: layout.unit[0] });
  }, [config, config.mainSelection, layout.unit, setConfig]);

  /**
   * Update the config.
   */
  const handleConfigUpdate = (field, value) => setConfig({ ...config, [field]: value });

  if (!layout) {
    return null;
  }

  return (
    <Grid container alignItems="flex-end" wrap="nowrap" className={classes.root}>
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

      <Grid item style={{ marginLeft: 90 }}>
        <Typography variant="body1" color="primary">SELECT UNIT</Typography>
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
    </Grid>
  );
};

export default HorizontalControlBar;
