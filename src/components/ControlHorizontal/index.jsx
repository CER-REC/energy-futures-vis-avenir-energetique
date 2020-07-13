import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Grid, Typography, Button, Menu, MenuItem, ListItemIcon, ListItemText,
} from '@material-ui/core';
import ArrowDropIcon from '@material-ui/icons/ArrowDropDown';

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

const ControlHorizontal = () => {
  const { config, setConfig } = useContext(ConfigContext);

  /**
    * If the current selected unit is no longer available under the new source, then select the default unit.
    */
  useEffect(() => {
    layout.unit.indexOf(config.unit) === -1 && setConfig({ ...config, unit: layout.unit[0] });
  }, [config.mainSelection]);

  /**
   * Memorize the current menu structure based on the config.
   */
  const layout = useMemo(() => CONFIG_LAYOUT[config.mainSelection], [config.mainSelection]);

  /**
   * Icon of the selected source.
   */
  const SourceIcon = useMemo(() => CONFIG_REPRESENTATION[config.mainSelection].icon, [config.mainSelection]);

  const [anchorSource, setAnchorSource] = useState(null);
  const [anchorUnit, setAnchorUnit] = useState(null);
  const [anchorYear, setAnchorYear] = useState(null);
  const [anchorScenario, setAnchorScenario] = useState(null);

  if (!layout) {
    return null;
  }

  const onOpenMenuSource = (event) => setAnchorSource(event.currentTarget);
  const onCloseMenuSource = () => setAnchorSource(null);
  const onChangeMenuSource = (source) => () => {
    onCloseMenuSource();
    handleConfigUpdate('mainSelection', source);
  };

  const onOpenMenuUnit = (event) => setAnchorUnit(event.currentTarget);
  const onCloseMenuUnit = () => setAnchorUnit(null);
  const onChangeMenuUnit = (unit) => () => {
    onCloseMenuUnit();
    handleConfigUpdate('unit', unit);
  };

  const onOpenMenuYear = (event) => setAnchorYear(event.currentTarget);
  const onCloseMenuYear = () => setAnchorYear(null);
  const onChangeMenuYear = (year) => () => {
    onCloseMenuYear();
    handleConfigUpdate('year', year);
  };

  const onOpenMenuScenario = (event) => setAnchorScenario(event.currentTarget);
  const onCloseMenuScenario = () => setAnchorScenario(null);
  const onChangeMenuScenario = (scenario) => () => {
    onCloseMenuScenario();
    handleConfigUpdate('scenario', scenario);
  };

  /**
   * Update the config.
   */
  const handleConfigUpdate = (field, value) => setConfig({ ...config, [field]: value });

  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item><Typography variant="h6" color="primary">Filters:</Typography></Grid>

      <Grid item>
        <Button
          variant="outlined" color="secondary"
          startIcon={<SourceIcon />}
          endIcon={<ArrowDropIcon />}
          onClick={onOpenMenuSource}
        >
          Source: {CONFIG_REPRESENTATION[config.mainSelection].name}
        </Button>
        <Menu anchorEl={anchorSource} open={!!anchorSource} onClose={onCloseMenuSource}>
          {Object.keys(CONFIG_LAYOUT).map(source => {
            const Icon = CONFIG_REPRESENTATION[source].icon;
            return (
              <MenuItem
                key={`config-source-${source}`} dense
                disabled={config.mainSelection === source}
                onClick={onChangeMenuSource(source)}
              >
                <ListItemIcon>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={CONFIG_REPRESENTATION[source].name} />
              </MenuItem>
            );
          })}
        </Menu>
      </Grid>

      <Grid item>
        <Button variant="outlined" color="primary" endIcon={<ArrowDropIcon />} onClick={onOpenMenuUnit}>
          Unit: {CONFIG_REPRESENTATION[config.unit]}
        </Button>
        <Menu anchorEl={anchorUnit} open={!!anchorUnit} onClose={onCloseMenuUnit}>
          {layout.unit.map(unit => (
            <MenuItem
              key={`config-unit-${unit}`} dense
              disabled={config.unit === unit}
              onClick={onChangeMenuUnit(unit)}
            >
              {CONFIG_REPRESENTATION[unit]}
            </MenuItem>
          ))}
        </Menu>
      </Grid>

      <Grid item>
        <Button variant="outlined" color="primary" endIcon={<ArrowDropIcon />} onClick={onOpenMenuYear}>
          Year: {config.year}
        </Button>
        <Menu anchorEl={anchorYear} open={!!anchorYear} onClose={onCloseMenuYear}>
          {layout.year.map(year => (
            <MenuItem
              key={`config-year-${year}`} dense
              disabled={config.year === year}
              onClick={onChangeMenuYear(year)}
            >
              {year}
            </MenuItem>
          ))}
        </Menu>
      </Grid>

      <Grid item>
        <Button variant="outlined" color="primary" endIcon={<ArrowDropIcon />} onClick={onOpenMenuScenario}>
          Scenario: {CONFIG_REPRESENTATION[config.scenario]}
        </Button>
        <Menu anchorEl={anchorScenario} open={!!anchorScenario} onClose={onCloseMenuScenario}>
          {layout.scenario.map(scenario => (
            <MenuItem
              key={`config-scenario-${scenario}`} dense
              disabled={config.scenario === scenario}
              onClick={onChangeMenuScenario(scenario)}
            >
              {CONFIG_REPRESENTATION[scenario]}
            </MenuItem>
          ))}
        </Menu>
      </Grid>
    </Grid>
  );
};

export default ControlHorizontal;
