import React, { useEffect, useMemo, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Grid, Typography, CircularProgress } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import EmailIcon from '@material-ui/icons/Email';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { useIntl } from 'react-intl';

import { CONFIG_LAYOUT } from '../../constants';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';
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
import { IconTwitter, IconFacebook, IconLinkedIn } from '../../icons';

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
  const { config, setConfig } = useConfig();
  const { loading, error, data, disabledRegions, disabledSources, year } = useEnergyFutureData();

  /**
   * Determine the current energy source type.
   * This will be primarily used in the tooltip generation.
   */
  const type = useMemo(() => {
    if (config.page === 'by-sector') return 'energy';
    if (config.page === 'electricity') return 'electricity';
    if (config.page === 'oil-and-gas') return config.mainSelection === 'gasProduction' ? 'gas' : 'oil';
    return undefined;
  }, [config.page, config.mainSelection]);

  /**
   * Reset the source list when opening 'by-sector' and 'electricity' pages.
   */
  useEffect(
    // TODO: This logic should be in the reducer when that is implemented
    () => {
      let selectedSources = config.sources;
      let selectedSourceOrder = config.sourceOrder;
      const validSources = sources[type]?.order || [];

      if (
        (selectedSourceOrder.length !== validSources.length)
        || !validSources.every(source => selectedSourceOrder.includes(source))
      ) {
        selectedSources = validSources;
        selectedSourceOrder = validSources;
      } else if (!selectedSources.every(source => validSources.includes(source))) {
        selectedSources = validSources;
      }

      // also update the main selection accordingly
      let { mainSelection } = config;

      if (!CONFIG_LAYOUT[mainSelection]?.pages.includes(config.page)) {
        mainSelection = Object.keys(CONFIG_LAYOUT).find(
          selection => CONFIG_LAYOUT[selection]?.pages.includes(config.page),
        ) || mainSelection;
      }

      if (config.page === 'oil-and-gas' && mainSelection === 'energyDemand') {
        mainSelection = 'oilProduction';
      }

      setConfig({
        ...config,
        mainSelection,
        sources: selectedSources,
        sourceOrder: selectedSourceOrder,
      });
    },
    [config.page], // eslint-disable-line react-hooks/exhaustive-deps
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
        label: intl.formatMessage({ id: `regions.${region}` }),
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
            <LinkButtonGroup
              labels={[
                [
                  { name: 'download data' },
                ], [
                  { icon: <LinkIcon />, name: 'Copy Link', content: () => {} },
                  { icon: <IconLinkedIn />, name: 'LinkedIn', content: () => {} },
                  { icon: <IconFacebook />, name: 'Facebook', content: () => {} },
                  { icon: <IconTwitter />, name: 'Twitter', content: () => {} },
                  { icon: <EmailIcon />, name: 'Email', content: () => {} },
                ],
              ]}
              accent="right"
            />
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
              { name: 'report', content: <LinkButtonContentReport /> },
              { name: 'assumptions', content: <LinkButtonContentAssumptions yearId={config.yearId} /> },
              { name: 'key findings', content: <LinkButtonContentKeyFindings yearId={config.yearId} /> },
              { name: 'results', content: <LinkButtonContentResults yearId={config.yearId} /> },
            ], [
              { name: 'methodology', content: <LinkButtonContentMethodology /> },
              { name: 'about', content: <LinkButtonContentAbout /> },
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
                greyscale={config.page === 'electricity' && config.view === 'source'}
                sourceType={type}
                items={config.sources}
                itemOrder={config.sourceOrder}
                defaultItems={sourceItems}
                defaultItemOrder={sources[type].order}
                disabledItems={config.page === 'by-sector' && disabledSources}
                setItems={selectedSources => setConfig({ ...config, sources: selectedSources })}
                setItemOrder={sourceOrder => setConfig({ ...config, sourceOrder })}
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
                greyscale={
                  config.page === 'by-sector' || config.page === 'scenarios'
                  || (config.page === 'electricity' && config.view !== 'source')
                }
                items={config.provinces}
                itemOrder={config.provinceOrder}
                defaultItems={regionItems}
                defaultItemOrder={regions.order}
                disabledItems={config.page === 'by-region' && disabledRegions}
                setItems={provinces => setConfig({ ...config, provinces })}
                setItemOrder={provinceOrder => setConfig({ ...config, provinceOrder })}
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
