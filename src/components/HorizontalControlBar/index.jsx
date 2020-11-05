// #region imports
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import {
  makeStyles, createStyles,
  Grid, Typography, Button, Tooltip,
} from '@material-ui/core';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import { CONFIG_LAYOUT } from '../../constants';
import { HintMainSelect, HintViewSelect, HintSectorSelect, HintUnitSelect } from '../Hint';
// #endregion

const useStyles = makeStyles(theme => createStyles({
  root: {
    height: 40,
    padding: theme.spacing(0.5, 2),
    backgroundColor: '#F3EFEF',
    '& p': { fontWeight: 700 },
  },
  btnSector: {
    height: 30,
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
  const intl = useIntl();

  const { sectors } = useAPI();
  const { config, configDispatch } = useConfig();
  const layout = useMemo(() => CONFIG_LAYOUT[config.mainSelection], [config.mainSelection]);

  if (!layout) {
    return null;
  }

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
            title={intl.formatMessage({ id: `components.mainSelect.${selection}.description` })}
            classes={{ tooltip: classes.tooltip }}
          >
            <Button
              variant={config.mainSelection === selection ? 'contained' : 'outlined'}
              color="primary"
              size="small"
              onClick={() => configDispatch({ type: 'mainSelection/changed', payload: selection })}
              className={classes.btnSector}
            >
              {intl.formatMessage({ id: `components.mainSelect.${selection}.title` })}
            </Button>
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  );

  const sectorSelection = ['by-sector', 'demand'].includes(config.page) && (
    <Grid container alignItems="center" wrap="nowrap" spacing={1}>
      <Grid item style={{ paddingRight: 0 }}>
        <HintSectorSelect>
          <Typography variant="body1" color="primary">{intl.formatMessage({ id: 'components.sectorSelect.name' })}</Typography>
        </HintSectorSelect>
      </Grid>
      {sectors.order.map((sector) => {
        const Icon = sectors.icons[sector];

        return (
          <Grid item key={`config-sector-${sector}`}>
            <Tooltip
              title={intl.formatMessage({ id: `components.sectorSelect.${sector}.description` })}
              classes={{ tooltip: classes.tooltip }}
            >
              <Button
                variant={config.sector === sector ? 'contained' : 'outlined'}
                color="primary"
                size="small"
                onClick={() => configDispatch({ type: 'sector/changed', payload: sector })}
                className={classes.btnSector}
              >
                {Icon ? <Icon /> : intl.formatMessage({ id: `common.sectors.${sector}` }) }
              </Button>
            </Tooltip>
          </Grid>
        );
      })}
    </Grid>
  );

  const views = ['electricity', 'oil-and-gas'].includes(config.page) && (
    <Grid container alignItems="center" wrap="nowrap">
      <HintViewSelect>
        <Typography variant="body1" color="primary">{intl.formatMessage({ id: 'components.viewSelect.name' })}</Typography>
      </HintViewSelect>
      {['region', 'source'].map(view => (
        <Tooltip
          key={`config-view-${view}`}
          title={intl.formatMessage({ id: `components.viewSelect.${view}.description` })}
        >
          <Button
            variant={config.view === view ? 'contained' : 'outlined'}
            color="primary"
            size="small"
            onClick={() => configDispatch({ type: 'view/changed', payload: view })}
          >
            {intl.formatMessage({ id: `common.${view}` })}
          </Button>
        </Tooltip>
      ))}
    </Grid>
  );

  const units = (
    <Grid container alignItems="center" wrap="nowrap">
      <HintUnitSelect>
        <Typography variant="body1" color="primary">{intl.formatMessage({ id: 'components.unitSelect.name' })}</Typography>
      </HintUnitSelect>
      {layout.unit.map(unit => (
        <Tooltip
          key={`config-unit-${unit}`}
          title={(
            <>
              <Typography variant="caption" component="div" gutterBottom><strong>{intl.formatMessage({ id: `components.unitSelect.${unit}.title` })}</strong></Typography>
              <Typography variant="caption" component="div">{intl.formatMessage({ id: `components.unitSelect.${unit}.description` })}</Typography>
            </>
          )}
        >
          <Button
            variant={config.unit === unit ? 'contained' : 'outlined'}
            color="primary"
            size="small"
            onClick={() => configDispatch({ type: 'unit/changed', payload: unit })}
            style={{ textTransform: 'none' }}
          >
            {intl.formatMessage({ id: `common.units.${unit}` })}
          </Button>
        </Tooltip>
      ))}
    </Grid>
  );

  return (
    <Grid container justify="space-between" alignItems="center" wrap="nowrap" className={classes.root}>
      {[
        selections,
        sectorSelection,
        views,
        units,
      ].map(section => section && <Grid item key={`utility-section-${Math.random()}`}>{section}</Grid>)}
    </Grid>
  );
};

export default HorizontalControlBar;
