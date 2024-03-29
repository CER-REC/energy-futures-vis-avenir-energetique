import React, { useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Grid, Typography, CircularProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { useIntl } from 'react-intl';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';
import { validYear } from '../../utilities/parseData';
import { CONFIG_LAYOUT, PAGES } from '../../constants';
import DraggableVerticalList from '../DraggableVerticalList';
import LinkButtonGroup from '../LinkButtonGroup';
import Share from '../Share';
import Header from '../Header';
import useChartTitle from '../../hooks/useChartTitle';
import DropDown from '../Dropdown';
import analytics from '../../analytics';
import HintUnit from '../HintUnit';

const gutterWidth = 70;

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    padding: theme.spacing(2, 0),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
  graph: {
    display: 'flex',
    flex: 1,
    height: 'auto',
    width: '100%',
    '& > div': { margin: 'auto' },
  },
  vis: {
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  report: {
    position: 'absolute',
    top: 11,
    right: -8,
  },
  dropDown: {
    width: 120,
    textAlign: 'center',
  },
  dropDownMenu: {
    '& .MuiListItem-root': {
      justifyContent: 'center',
    },
  },
  labelContainer: {
    ...theme.mixins.labelContainer,
    ...theme.mixins.unitContainer,
  },
}));

const PageLayout = ({
  children,
  showRegion,
  showSource,
  disableDraggableRegion,
  disableDraggableSource,
  singleSelectRegion,
  singleSelectSource,
}) => {
  const classes = useStyles();
  const intl = useIntl();

  const { regions, sources } = useAPI();
  const { config, configDispatch } = useConfig();
  const { loading, error, disabledRegions, disabledSources, year } = useEnergyFutureData();

  /**
   * Update baseYear and compareYear if they are not valid.
   * TODO: this can be move into the reducer if it has year min / max values.
   */
  useEffect(() => {
    const baseYear = validYear(config.baseYear, year || {});
    if (baseYear !== (config.baseYear || 0)) { configDispatch({ type: 'baseYear/changed', payload: baseYear }); }
    const compareYear = validYear(config.compareYear, year || {});
    if (compareYear !== (config.compareYear || 0)) { configDispatch({ type: 'compareYear/changed', payload: compareYear }); }
  }, [year, config.baseYear, config.compareYear, configDispatch]);

  /**
   * Determine the current energy source type.
   * This will be primarily used in the tooltip generation.
   */
  const type = useMemo(
    () => PAGES.find(page => page.id === config.page).sourceTypes?.[config.mainSelection],
    [config.page, config.mainSelection],
  );

  /**
   * Prepare items for draggable lists; one for sources and another for regions.
   */
  const regionItems = useMemo(
    () => regions.order.reduce((items, region) => ({
      ...items,
      [region]: {
        color: regions.colors[region],
        label: intl.formatMessage({ id: `common.regions.${region}` }),
      },
    }), {}),
    [regions, intl],
  );
  const sourceItems = useMemo(
    () => (type ? sources[type].order : []).reduce((items, source) => ({
      ...items,
      [source]: {
        color: sources[type].colors[source],
        icon: sources[type].icons[source],
        label: intl.formatMessage({ id: `common.sources.${type}.${source}` }),
      },
    }), {}),
    [type, sources, intl],
  );

  const vizWidth = useMemo(
    () => `calc(100% - ${((showSource ? 1 : 0) + (showRegion ? 1 : 0)) * 70}px`,
    [showSource, showRegion],
  );

  const chartTitle = useChartTitle();

  const layout = useMemo(() => CONFIG_LAYOUT[config.mainSelection], [config.mainSelection]);

  const handleUpdateUnit = useCallback((unit) => {
    configDispatch({ type: 'unit/changed', payload: unit });
    analytics.reportFeature(config.page, 'unit', unit);
  }, [configDispatch, config.page]);

  /**
   * Render nothing if the baseYear value is out of range.
   */
  if (config.baseYear && config.baseYear !== validYear(config.baseYear, year || {})) {
    return null;
  }

  /**
   * Render nothing if the compareYear value is out of range.
   */
  if (config.compareYear && config.compareYear !== validYear(config.compareYear, year || {})) {
    return null;
  }

  return (
    <Grid container spacing={2} className={classes.root}>
      <Header />
      <Grid item style={{ flex: 1, width: '100%' }}>
        <Grid container style={{ flex: 1 }}>
          <Grid container item>
            <Grid
              item
              style={{
                flex: 1,
                paddingLeft: gutterWidth * (showSource && showRegion ? 2 : 1),
              }}
            >
              <Typography variant="h6">
                {chartTitle}
              </Typography>
            </Grid>
            <Grid item className={classes.labelContainer}>
              <Typography variant="subtitle1">{intl.formatMessage({ id: 'components.pageLayout.unit' })}</Typography>
              <HintUnit />
              <DropDown
                options={layout.unit.map(unit => [intl.formatMessage({ id: `common.units.${unit}` }), unit])}
                value={config.unit}
                onChange={handleUpdateUnit}
                className={classes.dropDown}
                menuClassName={classes.dropDownMenu}
              />
            </Grid>
          </Grid>
          <Grid container>
            {showSource && (
              <Grid item style={{ width: gutterWidth }}>
                <DraggableVerticalList
                  shape={config.mainSelection === 'greenhouseGasEmission' ? 'hexagon' : 'circle'}
                  disabled={disableDraggableSource}
                  singleSelect={singleSelectSource}
                  greyscale={singleSelectSource || config.page === 'scenarios'}
                  sourceType={type}
                  items={config.sources}
                  itemOrder={config.sourceOrder}
                  defaultItems={sourceItems}
                  defaultItemOrder={sources[type].order}
                  disabledItems={disabledSources}
                  setItems={selectedSources => configDispatch({ type: 'sources/changed', payload: selectedSources })}
                  setItemOrder={sourceOrder => configDispatch({ type: 'sourceOrder/changed', payload: sourceOrder })}
                />
              </Grid>
            )}
            {showRegion && (
              <Grid item style={{ width: gutterWidth }}>
                <DraggableVerticalList
                  dense
                  disabled={disableDraggableRegion}
                  singleSelect={singleSelectRegion}
                  greyscale={singleSelectRegion}
                  items={config.provinces}
                  itemOrder={config.provinceOrder}
                  defaultItems={regionItems}
                  defaultItemOrder={regions.order}
                  disabledItems={disabledRegions}
                  setItems={provinces => configDispatch({ type: 'provinces/changed', payload: provinces })}
                  setItemOrder={provinceOrder => configDispatch({ type: 'provinceOrder/changed', payload: provinceOrder })}
                />
              </Grid>
            )}
            <Grid container item direction="column" style={{ width: vizWidth }}>
              {children?.length && children?.length > 0 && (
                <Grid item className={classes.graph}>
                  {loading && <CircularProgress color="primary" size={66} />}
                  {error && <Alert severity="error"><AlertTitle>Error</AlertTitle>{error}</Alert>}
                  {!loading && !error && <div className={classes.vis}>{children}</div>}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="flex-start" wrap="nowrap" spacing={2}>
          <Grid item><LinkButtonGroup /></Grid>
          <Grid item style={{ flexGrow: 1 }} />
          <Grid item><Share direction="row" /></Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node,
  showRegion: PropTypes.bool,
  showSource: PropTypes.bool,
  disableDraggableRegion: PropTypes.bool,
  disableDraggableSource: PropTypes.bool,
  singleSelectRegion: PropTypes.bool,
  singleSelectSource: PropTypes.bool,
};

PageLayout.defaultProps = {
  children: undefined,
  showRegion: false,
  showSource: false,
  disableDraggableRegion: false,
  disableDraggableSource: false,
  singleSelectRegion: false,
  singleSelectSource: false,
};

export default PageLayout;
