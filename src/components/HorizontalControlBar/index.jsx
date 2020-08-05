// #region imports
import React, { useContext, useMemo, useEffect, useState } from 'react';
import {
  makeStyles, createStyles,
  Grid, Typography,
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
    width: props.width || '90%',
    '& > div': { textAlign: 'center' },
    paddingLeft: '20px',
    marginLeft: '0px',
    paddingTop: '12px',
    paddingBottom: '10px',
    backgroundColor: '#F3EFEF',
    height: '40px',
  }),
  selectUnitLabel: {
    minWidth: '60px',
    width: '125px',
    textAlign: 'center',
    fontWeight: '900',
    fontSize: '14pt',
    color: '#4A93C7',
    fontFamily: 'Roboto Condensed, Helvetica, Arial, sans-serif',
  },
  viewByLabel: {
    marginRight: 8,
    minWidth: 80,
    width: 70,
    border: 'none',
    fontWeight: 'bold',
    fontSize: '14pt',
    color: '#4A93C7',
    fontFamily: 'Roboto Condensed, Helvetica, Arial, sans-serif',
  },
  buttonSelected: {
    borderRadius: '0 !important',
    height: '28px !important',
    color: 'white !important',
    backgroundColor: '#4A93C7 !important',
    fontWeight: '900 !important',
    border: '0px !important',
    fontFamily: 'Roboto Condensed, Helvetica, Arial, sans-serif',
  },
  buttonUnselected: {
    borderRadius: 0,
    height: '28px',
    color: 'black',
    backgroundColor: '#ffffff',
    fontWeight: '900',
    border: '1px solid #898989',
    fontFamily: 'Roboto Condensed, Helvetica, Arial, sans-serif',
  },
}));

const HorizontalControlBar = () => {
  const classes = useStyles();
  const { config, setConfig } = useContext(ConfigContext);
  const layout = useMemo(() => CONFIG_LAYOUT[config.mainSelection], [config.mainSelection]);
  const handleConfigUpdate = (field, value) => () => setConfig({ ...config, [field]: value });

  // TODO: Make this more meaningful than just a state object.
  const [selectedView, setSelectedView] = useState('region');

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

  const handleUnitUpdate = (event, newUnit) => {
    handleConfigUpdate('unit', newUnit);
  };
  const handleViewUpdate = (event, newView) => {
    setSelectedView(newView);
  };

  const unitButtons = layout.unit.map((unit) => {
    const styles = (unit === config.unit)
      ? classes.buttonSelected
      : classes.buttonUnselected;
    return (
      <ToggleButton
        value={unit}
        className={styles}
        key={`${unit}-button`}
      >
        <Typography>
          {CONFIG_REPRESENTATION[unit]}
        </Typography>
      </ToggleButton>
    );
  });

  const viewButtons = ['region', 'source'].map((view) => {
    const styles = (view === selectedView)
      ? { classes: { selected: classes.buttonSelected } }
      : { className: classes.buttonUnselected };
    return (
      <ToggleButton
        value={view}
        {...styles}
        key={`${view}-button`}
      >
        <Typography>{view}</Typography>
      </ToggleButton>
    );
  });

  return (
    <Grid container alignItems="center" wrap='nowrap' spacing={5} className={classes.root}>
      <Typography className={classes.viewByLabel} variant='body1'>VIEW BY</Typography>
      <ToggleButtonGroup
        value={selectedView}
        onChange={handleViewUpdate}
        exclusive
        style={{ paddingRight: '90px' }}
      >
        {viewButtons}
      </ToggleButtonGroup>
      <Grid item>
        <Typography className={classes.selectUnitLabel}>SELECT UNIT</Typography>
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
