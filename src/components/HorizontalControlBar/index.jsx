// #region imports
import React, { useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import {
  makeStyles, createStyles,
  Grid, Typography, Button, Tooltip,
} from '@material-ui/core';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import analytics from '../../analytics';
import { CONFIG_LAYOUT, SECTOR_ORDER } from '../../constants';
import { HintMainSelect, HintViewSelect, HintSectorSelect } from '../Hint';
// #endregion

const useStyles = makeStyles(theme => createStyles({
  root: {
    padding: theme.spacing(0.5, 2),
    '& p': { fontWeight: 700 },
  },
  btnSector: {
    height: 30,
    minWidth: 45,
    textTransform: 'none',
    '& > span': { lineHeight: 1 },
  },
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.secondary.main,
    maxWidth: 220,
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: 0,
  },
}));

const HorizontalControlBar = () => {
  const classes = useStyles();
  const intl = useIntl();

  const { sectors } = useAPI();
  const { config, configDispatch } = useConfig();
  const layout = useMemo(() => CONFIG_LAYOUT[config.mainSelection], [config.mainSelection]);

  const handleUpdateAppendix = useCallback((selection) => {
    configDispatch({ type: 'mainSelection/changed', payload: selection });
    analytics.reportFeature(config.page, 'main selection', selection);
  }, [configDispatch, config.page]);

  const handleUpdateSector = useCallback((sector) => {
    configDispatch({ type: 'sector/changed', payload: sector });
    analytics.reportFeature(config.page, 'sector', sector.toLowerCase());
  }, [configDispatch, config.page]);

  const handleUpdateView = useCallback((view) => {
    configDispatch({ type: 'view/changed', payload: view });
    analytics.reportFeature(config.page, 'view by', view);
  }, [configDispatch, config.page]);

  if (!layout) {
    return null;
  }

  /**
   * Main selection
   */
  const appendices = Object.keys(CONFIG_LAYOUT).filter(
    selection => CONFIG_LAYOUT[selection].pages.includes(config.page),
  );
  const selections = (appendices.length > 1) && (
    <Grid container alignItems="center" wrap="nowrap" spacing={1}>
      <Grid item style={{ paddingRight: 0 }}>
        <HintMainSelect />
      </Grid>
      {appendices.map(selection => (
        <Grid item key={`config-origin-${selection}`}>
          <Tooltip
            title={intl.formatMessage({ id: `components.mainSelect.${selection}.tooltip.${config.page}` })}
            classes={{ tooltip: classes.tooltip }}
          >
            <Button
              variant={config.mainSelection === selection ? 'contained' : 'outlined'}
              color="primary"
              size="small"
              onClick={() => handleUpdateAppendix(selection)}
              className={classes.btnSector}
            >
              {intl.formatMessage({ id: `components.mainSelect.${selection}.title` })}
            </Button>
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  );

  /**
   * Sector
   */
  const sectorSelection = ['by-sector', 'demand'].includes(config.page) && (
    <Grid container alignItems="center" wrap="nowrap" spacing={1}>
      <Grid item style={{ paddingRight: 0 }}>
        <HintSectorSelect>
          <Typography variant="body1" color="secondary">{intl.formatMessage({ id: 'components.sectorSelect.name' })}</Typography>
        </HintSectorSelect>
      </Grid>
      {SECTOR_ORDER.filter(sector => sectors.order.find(s => s === sector)).map((sector) => {
        const Icon = sectors.icons[sector];

        return (
          <Grid item key={`config-sector-${sector}`}>
            <Tooltip
              title={intl.formatMessage({ id: `components.sectorSelect.${sector}.tooltip` })}
              classes={{ tooltip: classes.tooltip }}
            >
              <Button
                variant={config.sector === sector ? 'contained' : 'outlined'}
                color="primary"
                size="small"
                onClick={() => handleUpdateSector(sector)}
                className={classes.btnSector}
              >
                {Icon && <Icon /> }
                {intl.formatMessage({ id: `common.sectors.${sector}` })}
              </Button>
            </Tooltip>
          </Grid>
        );
      })}
    </Grid>
  );

  /**
   * View by
   */
  const views = ['electricity', 'oil-and-gas'].includes(config.page) && (
    <Grid container alignItems="center" wrap="nowrap">
      <HintViewSelect>
        <Typography variant="body1" color="secondary">{intl.formatMessage({ id: 'components.viewSelect.name' })}</Typography>
      </HintViewSelect>
      {['region', 'source'].map(view => (
        <Tooltip
          key={`config-view-${view}`}
          title={intl.formatMessage({ id: `components.viewSelect.${view}.tooltip.${config.page}.${config.mainSelection}` })}
        >
          <Button
            variant={config.view === view ? 'contained' : 'outlined'}
            color="primary"
            size="small"
            onClick={() => handleUpdateView(view)}
          >
            {intl.formatMessage({ id: `common.${view === 'source' && config.page === 'oil-and-gas' ? 'type' : view}` })}
          </Button>
        </Tooltip>
      ))}
    </Grid>
  );

  return (
    <Grid container justify={config.page === 'electricity' ? 'flex-start' : 'space-between'} alignItems="center" spacing={1} className={classes.root}>
      { selections && (<Grid item>{selections}</Grid>) }
      <Grid item>{sectorSelection}</Grid>
      <Grid item>{views}</Grid>
    </Grid>
  );
};

export default HorizontalControlBar;
