import React, { useEffect, useMemo, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Grid, CircularProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { useIntl } from 'react-intl';

import { PAGES } from '../../constants';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';
import YearSelect from '../YearSelect';
import PageSelect from '../PageSelect';
import ScenarioSelect from '../ScenarioSelect';
import DraggableVerticalList from '../DraggableVerticalList';
import HorizontalControlBar from '../HorizontalControlBar';
import LinkButtonGroup from '../LinkButtonGroup';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4, 0),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
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
  const { loading, error, data, year } = useEnergyFutureData();

  const type = PAGES.find(page => page.id === config.page).sourceType;

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

      setConfig({
        ...config,
        sources: selectedSources,
        sourceOrder: selectedSourceOrder,
      });
    },
    [config.page], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const vis = useMemo(
    () => Children.map(children, child => child && cloneElement(child, { data, year })),
    [children, data, year],
  );
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
      <Grid item xs={12}><YearSelect /></Grid>
      <Grid item style={{ width: 400 }}><PageSelect /></Grid>
      <Grid item style={{ width: 'calc(100% - 400px)' }}>
        <Grid container direction="column" wrap="nowrap" spacing={1} style={{ width: 'calc(100% - 50px)' }}>
          <Grid item><ScenarioSelect multiSelect={multiSelectScenario} /></Grid>
          <Grid item><HorizontalControlBar /></Grid>
        </Grid>
      </Grid>
      <Grid item style={{ position: 'relative', width: 100 }}>
        <LinkButtonGroup
          title="Context"
          labels={[['assumptions', 'results', 'report'], ['methodology', 'about']]}
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
                items={config.sources}
                itemOrder={config.sourceOrder}
                defaultItems={sourceItems}
                defaultItemOrder={sources[type].order}
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
