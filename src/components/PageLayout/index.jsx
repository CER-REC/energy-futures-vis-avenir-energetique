import React, { useMemo, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Grid, Typography, CircularProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { useIntl } from 'react-intl';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';
import { PAGES } from '../../constants';
import YearSelect from '../YearSelect';
import PageSelect from '../PageSelect';
import ScenarioSelect from '../ScenarioSelect';
import DraggableVerticalList from '../DraggableVerticalList';
import HorizontalControlBar from '../HorizontalControlBar';
import LinkButtonGroup from '../LinkButtonGroup';
import {
  LinkButtonContentAssumptions, LinkButtonContentKeyFindings, LinkButtonContentResults,
  LinkButtonContentReport, LinkButtonContentMethodology, LinkButtonContentAbout,
} from '../LinkButtonGroup/contents';
import Share from '../Share';

const LEAD_COL_WIDTH = 400;

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    padding: theme.spacing(2, 0),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    width: LEAD_COL_WIDTH,
    '& > h4': {
      fontWeight: 700,
      textTransform: 'uppercase',
    },
  },
  graph: {
    display: 'flex',
    flexGrow: 1,
    height: 'auto',
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
    left: 0,
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

  return (
    <Grid container spacing={2} className={classes.root}>
      {/* Row 1: main title; year select; social media links */}
      <Grid item xs={12}>
        <Grid container alignItems="flex-end" wrap="nowrap" spacing={2}>
          <Grid item className={classes.title}>
            <Typography variant="h4" color="primary">{intl.formatMessage({ id: 'common.title' })}</Typography>
          </Grid>
          <Grid item style={{ flexGrow: 1 }}><YearSelect /></Grid>
          <Grid item className={classes.report}>
            <Share />
          </Grid>
        </Grid>
      </Grid>

      {/* Row 2: page select; scenario select and utility bar (stacked) */}
      <Grid item style={{ width: LEAD_COL_WIDTH }}><PageSelect /></Grid>
      <Grid item style={{ width: `calc(100% - ${LEAD_COL_WIDTH}px)` }}>
        <Grid container direction="column" wrap="nowrap" spacing={1} style={{ width: 'calc(100% - 50px)' }}>
          <Grid item><ScenarioSelect multiSelect={multiSelectScenario} /></Grid>
          <Grid item><HorizontalControlBar /></Grid>
        </Grid>
      </Grid>

      {/* Row 3: link buttons (at bottom); vertical draggable lists; visualization */}
      <Grid item style={{ position: 'relative', width: 100 }}>
        <LinkButtonGroup
          title="Context"
          labels={[
            [
              { name: intl.formatMessage({ id: 'links.Report.title' }), content: <LinkButtonContentReport /> },
              { name: intl.formatMessage({ id: 'links.Assumptions.title' }), content: <LinkButtonContentAssumptions yearId={config.yearId} /> },
              { name: intl.formatMessage({ id: 'links.Findings.title' }), content: <LinkButtonContentKeyFindings yearId={config.yearId} /> },
              { name: intl.formatMessage({ id: 'links.Results.title' }), content: <LinkButtonContentResults yearId={config.yearId} /> },
            ], [
              { name: intl.formatMessage({ id: 'links.Methodology.title' }), content: <LinkButtonContentMethodology /> },
              { name: intl.formatMessage({ id: 'links.About.title' }), content: <LinkButtonContentAbout /> },
            ]]}
          className={classes.links}
        />
      </Grid>
      <Grid item style={{ width: 'calc(100% - 100px)' }}>
        <Grid container wrap="nowrap" spacing={2}>
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
