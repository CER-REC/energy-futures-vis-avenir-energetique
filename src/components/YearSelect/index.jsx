import React, { useContext, useMemo } from 'react';
import {
  makeStyles, createStyles, fade,
  Grid, Typography, IconButton,
} from '@material-ui/core';
import ArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { ConfigContext } from '../../containers/App/lazy';
import { CONFIG_REPRESENTATION } from '../../types';
import { TABS } from '../../constants';


const YEARS = ['2019', '2018', '2017', '2016'];

const YearSelect = () => {
  const classes = useStyles();

  const { config, setConfig } = useContext(ConfigContext);

  const yearIndex = useMemo(() => YEARS.indexOf(config.year) > -1 ? YEARS.indexOf(config.year) : 0, [config.year]);

  /**
   * Update the config.
   */
  const handleConfigUpdate = (field, value) => setConfig({ ...config, [field]: value });

  /**
   * Rotate the year number with arrow buttons.
   */
  const handleSelectPreviousYear = () => handleConfigUpdate('year', YEARS[(yearIndex + 1 + YEARS.length) % YEARS.length] || YEARS[0]);
  const handleSelectNextYear = () => handleConfigUpdate('year', YEARS[(yearIndex - 1 + YEARS.length) % YEARS.length] || YEARS[0]);

  /**
   * Toggle a different year number in the toggle group.
   */
  const handleToggleYear = (event, year) => YEARS.indexOf(year) > -1 && handleConfigUpdate('year', year);

  return (
    <Grid container alignItems="center" spacing={4}>
      <Grid item>
        <Typography variant="h5" color="primary">
          {TABS.find(tab => tab.page === config.page)?.label} / {CONFIG_REPRESENTATION[config.mainSelection].name}:
        </Typography>
      </Grid>

      <Grid item>
        <Grid container direction="column" alignItems="center" wrap="nowrap">
          <IconButton size="small" disabled={yearIndex < 1} onClick={handleSelectNextYear}>
            <ArrowUpIcon color={yearIndex < 1 ? 'disabled' : 'primary'} />
          </IconButton>
            <Typography variant="body1">{config.year}</Typography>
          <IconButton size="small" disabled={yearIndex >= YEARS.length - 1} onClick={handleSelectPreviousYear}>
            <ArrowDownIcon color={yearIndex >= YEARS.length - 1 ? 'disabled' : 'primary'} />
          </IconButton>
        </Grid>
      </Grid>
      
      <Grid item>
        <Grid container className={classes.root}>
          <ToggleButtonGroup
            value={config.year} onChange={handleToggleYear}
            exclusive size="small" classes={{ grouped: classes.grouped }}
          >
            {YEARS.map(year => (
              <ToggleButton key={`year-toggle-${year}`} value={year}  classes={{ selected: classes.selected }}>
                <Typography variant="body1" color={year === config.year ? 'primary' : 'textSecondary'}>{year}</Typography>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => createStyles({
  root: {
    border: `2px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },
  grouped: {
    minWidth: 100,
    margin: theme.spacing(1),
    border: 'none',
    '&:not(:first-child)': { borderRadius: theme.shape.borderRadius },
    '&:first-child': { borderRadius: theme.shape.borderRadius },
  },
  selected: {
    backgroundColor: `${fade(theme.palette.primary.main, .15)} !important`,
  },
}));

export default YearSelect;
