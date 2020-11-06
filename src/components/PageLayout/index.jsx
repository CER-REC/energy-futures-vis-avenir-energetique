import React, { useMemo, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useMediaQuery, Grid, Typography, CircularProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { useIntl } from 'react-intl';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';
import { PAGES } from '../../constants';
import YearSelect from '../YearSelect';
import { PageTitle, PageSelect } from '../PageSelect';
import ScenarioSelect from '../ScenarioSelect';
import DraggableVerticalList from '../DraggableVerticalList';
import HorizontalControlBar from '../HorizontalControlBar';
import LinkButtonGroup from '../LinkButtonGroup';
import { DownloadButton, Share } from '../Share';

const LEAD_COL_WIDTH = 400;

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    padding: theme.spacing(2, 0),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
  row: {
    height: `calc(100% + ${theme.spacing(2)}px)`,
    '& > div': { height: '100%' },
  },
  title: {
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  download: {
    height: '100%',
    '& > button': {
      height: '100%',
      textTransform: 'none',
    },
  },
  controls: {
    height: '100%',
    width: '100%',
    padding: theme.spacing(1, 0),
    backgroundColor: '#F3EFEF',
    '& > div:first-of-type': { marginBottom: theme.spacing(2) },
  },
  graph: {
    display: 'flex',
    flexGrow: 1,
    height: 700,
    '& > div': { margin: 'auto' },
  },
  vis: {
    height: '100%',
    width: '100%',
    position: 'relative',
    border: `1px solid ${theme.palette.divider}`,
  },
  links: {
    position: 'absolute',
    bottom: 0,
    left: -theme.spacing(1),
  },
  report: {
    position: 'absolute',
    top: 11,
    right: -8,
  },
}));

const PageLayout = ({
  children,
  multiSelectScenario,
  showRegion,
  showSource,
  disableDraggableRegion,
  disableDraggableSource,
  singleSelectRegion,
  singleSelectSource,
}) => {
  const classes = useStyles();
  const intl = useIntl();
  const desktop = useMediaQuery('(min-width: 992px)');

  const { regions, sources } = useAPI();
  const { config, configDispatch } = useConfig();
  const { loading, error, data, disabledRegions, disabledSources, year } = useEnergyFutureData();

  /**
   * Determine the current energy source type.
   * This will be primarily used in the tooltip generation.
   */
  const type = useMemo(
    () => PAGES.find(page => page.id === config.page).sourceTypes?.[config.mainSelection],
    [config.page, config.mainSelection],
  );

  /**
   * Genenate the DOM node which contains the visualization.
   */
  const vis = useMemo(
    () => Children.map(children, child => child && cloneElement(child, { data, year })),
    [children, data, year],
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

  /**
   * The main title, which can be reused in both desktop and mobile layouts.
   */
  const title = <Typography variant="h4" color="primary" className={classes.title}>{intl.formatMessage({ id: 'common.title' })}</Typography>;

  /**
   * The control panel, which can be reused in both desktop and mobile layouts.
   */
  const controls = (
    <Grid container direction="column" wrap="nowrap" className={classes.controls}>
      <Grid item><ScenarioSelect multiSelect={multiSelectScenario} /></Grid>
      <Grid item><HorizontalControlBar /></Grid>
    </Grid>
  );

  /**
   * Construct the header / controls based on the screen size.
   * Note: CER template uses custom breakpoints.
   */
  const header = desktop ? (
    <>
      {/* Row 1: main title; year select; download button */}
      <Grid item xs={12}>
        <Grid container alignItems="flex-end" wrap="nowrap" spacing={2}>
          <Grid item style={{ width: LEAD_COL_WIDTH }}>{title}</Grid>
          <Grid item style={{ flexGrow: 1 }}><YearSelect /></Grid>
          <Grid item className={classes.download}><DownloadButton accent /></Grid>
        </Grid>
      </Grid>

      {/* Row 2: page select; scenario select and utility bar (stacked); social media links */}
      <Grid item xs={12}>
        <Grid container alignItems="center" wrap="nowrap" spacing={2} className={classes.row}>
          <Grid item style={{ width: LEAD_COL_WIDTH }}><PageTitle /></Grid>
          <Grid item style={{ flexGrow: 1 }}>{controls}</Grid>
          <Grid item style={{ width: 40 }}><Share /></Grid>
        </Grid>
      </Grid>

      {/* Row 3: link buttons (at bottom); vertical draggable lists; visualization */}
      <Grid item style={{ width: 100 }}><PageSelect /></Grid>
    </>
  ) : (
    <>
      <Grid item xs={12}>{title}</Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center" wrap="nowrap" spacing={2} className={classes.row}>
          <Grid item><PageTitle /></Grid>
          <Grid item style={{ height: '100%' }}><PageSelect direction="row" /></Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>{controls}</Grid>
    </>
  );

  return (
    <Grid container spacing={2} className={classes.root}>
      {header}

      {showSource && (
        <Grid item>
          <DraggableVerticalList
            title="Source"
            round
            disabled={disableDraggableSource}
            singleSelect={singleSelectSource}
            greyscale={singleSelectSource}
            sourceType={type}
            items={config.sources}
            itemOrder={config.sourceOrder}
            defaultItems={sourceItems}
            defaultItemOrder={sources[type].order}
            disabledItems={config.page === 'by-sector' && disabledSources}
            setItems={selectedSources => configDispatch({ type: 'sources/changed', payload: selectedSources })}
            setItemOrder={sourceOrder => configDispatch({ type: 'sourceOrder/changed', payload: sourceOrder })}
          />
        </Grid>
      )}
      {showRegion && (
        <Grid item>
          <DraggableVerticalList
            title="Region"
            dense
            disabled={disableDraggableRegion}
            singleSelect={singleSelectRegion}
            greyscale={singleSelectRegion}
            items={config.provinces}
            itemOrder={config.provinceOrder}
            defaultItems={regionItems}
            defaultItemOrder={regions.order}
            disabledItems={config.page === 'by-region' && disabledRegions}
            setItems={provinces => configDispatch({ type: 'provinces/changed', payload: provinces })}
            setItemOrder={provinceOrder => configDispatch({ type: 'provinceOrder/changed', payload: provinceOrder })}
          />
        </Grid>
      )}
      {vis && (
        <Grid item className={classes.graph}>
          {loading && <CircularProgress color="primary" size={66} className={classes.loading} />}
          {error && <Alert severity="error"><AlertTitle>Error</AlertTitle>{error}</Alert>}
          {!loading && !error && <div className={classes.vis}>{vis}</div>}
        </Grid>
      )}

      <Grid item xs={12} className={desktop ? classes.links : ''}>
        <Grid container alignItems="flex-start" wrap="nowrap" spacing={2}>
          <Grid item><LinkButtonGroup direction={desktop ? 'column' : 'row'} /></Grid>
          <Grid item style={{ flexGrow: 1 }} />
          {!desktop && <Grid item className={classes.download}><DownloadButton /></Grid>}
          {!desktop && <Grid item><Share direction="row" /></Grid>}
        </Grid>
      </Grid>
    </Grid>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node,
  multiSelectScenario: PropTypes.bool,
  showRegion: PropTypes.bool,
  showSource: PropTypes.bool,
  disableDraggableRegion: PropTypes.bool,
  disableDraggableSource: PropTypes.bool,
  singleSelectRegion: PropTypes.bool,
  singleSelectSource: PropTypes.bool,
};

PageLayout.defaultProps = {
  children: undefined,
  multiSelectScenario: false,
  showRegion: false,
  showSource: false,
  disableDraggableRegion: false,
  disableDraggableSource: false,
  singleSelectRegion: false,
  singleSelectSource: false,
};

export default PageLayout;
