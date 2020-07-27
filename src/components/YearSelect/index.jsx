import React, { useContext, useState, useEffect, useMemo } from 'react';
import {
  makeStyles, createStyles, fade,
  Grid, Typography, Button, Menu, MenuItem, Tooltip, Hidden,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ArrowDropIcon from '@material-ui/icons/KeyboardArrowDown';

import { ConfigContext } from '../../containers/App/lazy';
import { CONFIG_REPRESENTATION } from '../../types';
import { CONFIG_LAYOUT, SCENARIO_LAYOUT, SCENARIO_TOOPTIP } from '../../constants';
import img_report from '../../images/report-link.png';

const TEXT_COLOR = '#1C2B3B';

const YearSelect = () => {
  const classes = useStyles();

  const { config, setConfig } = useContext(ConfigContext);

  /**
   * CER template turns to the tablet mode at width = 992px.
   */
  const desktop = useMediaQuery('(min-width: 992px)');

  /**
   * Control methods for the year drop-down.
   */
  const [anchorYear, setAnchorYear] = useState(null);
  const onOpenMenuYear = (event) => setAnchorYear(event.currentTarget);
  const onCloseMenuYear = () => setAnchorYear(null);
  const onChangeMenuYear = (year) => () => {
    onCloseMenuYear();
    handleConfigUpdate('year', year);
  };

  /**
   * Control methods for the scenario drop-down (only on small screens).
   */
  const [anchorScenario, setAnchorScenario] = useState(null);
  const onOpenMenuScenario = (event) => setAnchorScenario(event.currentTarget);
  const onCloseMenuScenario = () => setAnchorScenario(null);
  const onChangeMenuScenario = (scenario) => () => {
    onCloseMenuScenario();
    handleConfigUpdate('scenario', scenario);
  };

  /**
   * If the previous selected scenario is no longer available after the year change,
   * then auto-select the first scenario in the new list.
   */
  useEffect(() => {
    const scenarios = SCENARIO_LAYOUT[config.year] || SCENARIO_LAYOUT['default'];
    scenarios.indexOf(config.scenario) < 0 && handleConfigUpdate('scenario', scenarios[0]);
  }, [config.year]);

  /**
   * Memorize the current menu structure based on the config.
   */
  const layoutConfig = useMemo(() => CONFIG_LAYOUT[config.mainSelection], [config.mainSelection]);
  const layoutScenario = useMemo(() => SCENARIO_LAYOUT[config.year] || SCENARIO_LAYOUT['default'], [config.year]);

  /**
   * Update the config.
   */
  const handleConfigUpdate = (field, value) => setConfig({ ...config, [field]: value });

  return (
    <Grid container alignItems="center" className={classes.root}>
      <Grid item style={{ marginRight: 16 }}>
        <Grid container alignItems="center" wrap="nowrap" spacing={1}>

          {/* year select */}
          <Grid item>
            <Hidden lgUp>
              <Typography variant="body1" color="primary" className={classes.title}>
                Energy Futures From
              </Typography>
            </Hidden>
            <Hidden mdDown>
              <Typography variant="h6" color="primary" className={classes.title}>
                Energy Futures From
              </Typography>
            </Hidden>
          </Grid>

          <Grid item>
            <Button
              variant="outlined" color="primary" size="small"
              endIcon={<ArrowDropIcon />} onClick={onOpenMenuYear}
              className={classes.btnBlueSelected}
            >
              {config.year}
            </Button>
            <Menu anchorEl={anchorYear} open={!!anchorYear} onClose={onCloseMenuYear}>
              {layoutConfig.year.map(year => (
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
        </Grid>
      </Grid>

      {/* scenario select */}
      <Grid item>
        <Grid container alignItems="center" wrap="nowrap" spacing={1}>
          <Grid item>
            <Hidden lgUp>
              <Typography variant="body1" color="primary" className={classes.title}>
                Scenarios
              </Typography>
            </Hidden>
            <Hidden mdDown>
              <Typography variant="h6" color="primary" className={classes.title}>
                Scenarios
              </Typography>
            </Hidden>
          </Grid>

          {(desktop || layoutScenario.length < 2) ? layoutScenario.map(scenario => (
            <Grid item key={`config-scenario-${scenario}`}>
              <Tooltip title={SCENARIO_TOOPTIP[scenario]} classes={{ tooltip: classes.tooltip }}>
                <Button
                  color="primary" size="small" fullWidth
                  onClick={() => handleConfigUpdate('scenario', scenario)}
                  className={`${classes.btnBlue} ${config.scenario === scenario && classes.btnBlueSelected}`}
                >
                  {CONFIG_REPRESENTATION[scenario]}
                </Button>
              </Tooltip>
            </Grid>
          )) : (
            <Grid item>
              <Button
                variant="outlined" color="primary" size="small"
                endIcon={<ArrowDropIcon />} onClick={onOpenMenuScenario}
                className={classes.btnBlueSelected}
              >
                {CONFIG_REPRESENTATION[config.scenario]}
              </Button>
              <Menu anchorEl={anchorScenario} open={!!anchorScenario} onClose={onCloseMenuScenario}>
                {layoutScenario.map(scenario => (
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
          )}
        </Grid>
      </Grid>

      <Grid item className={classes.report}>
        <Grid container alignItems="flex-end" wrap="nowrap">
          <Typography variant="overline" style={{ color: TEXT_COLOR }}>read report</Typography>
          <img src={String(img_report).startsWith('/') ? img_report : `/${img_report}`} />
        </Grid>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => createStyles({
  root: {
    position: 'relative',
    '& > div:first-of-type': { marginRight: theme.spacing(2) },
  },
  title: {
    color: TEXT_COLOR,
    textTransform: 'uppercase',
  },
  selected: {
    backgroundColor: `${fade(theme.palette.primary.main, .15)} !important`,
  },
  btnBlue: {
    minWidth: 90,
    padding: theme.spacing(0, .5),
    border: '1px solid #647A90',
    borderRadius: 0,
    color: '#647A90',
    backgroundColor: theme.palette.common.white,
    '&:hover': {
      color: theme.palette.common.white,
      backgroundColor: '#647A90',
      boxShadow: theme.shadows[4],
    },
    [theme.breakpoints.down('md')]: { minWidth: 60 },
  },
  btnBlueSelected: {
    padding: theme.spacing(0, .5),
    borderRadius: 0,
    color: theme.palette.common.white,
    backgroundColor: TEXT_COLOR,
    '&:hover': {
      border: `1px solid ${TEXT_COLOR}`,
      backgroundColor: TEXT_COLOR,
      boxShadow: theme.shadows[4],
    },
  },
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: TEXT_COLOR,
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: `1px solid ${TEXT_COLOR}`,
    borderRadius: 0,
  },
  report: {
    position: 'absolute',
    top: '50%',
    right: 0,
    transform: 'translateY(-50%)',
    '& img': { height: 60 },
    '& span': {
      width: 50,
      margin: 2,
      lineHeight: 1,
      fontSize: 10,
      textAlign: 'right',
    },
  },
}));

export default YearSelect;
