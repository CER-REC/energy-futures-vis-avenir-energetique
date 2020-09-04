import React, { useEffect, useMemo, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Grid, CircularProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import useConfig from '../../hooks/useConfig';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';
import { REGIONS, REGION_ORDER, SOURCES, SOURCE_ORDER, ELECTRICITY_SOURCE_ORDER } from '../../types';
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
    border: `1px solid ${theme.palette.divider}`,
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
  const { config, setConfig } = useConfig();
  const { loading, error, data } = useEnergyFutureData();

  /**
   * Reset the source list when opening 'by-sector' and 'electricity' pages.
   */
  useEffect(
    () => {
      if (config.page === 'by-sector') {
        setConfig({ ...config, sources: SOURCE_ORDER, sourceOrder: SOURCE_ORDER });
      }
      if (config.page === 'electricity') {
        setConfig({
          ...config,
          sources: ELECTRICITY_SOURCE_ORDER,
          sourceOrder: ELECTRICITY_SOURCE_ORDER,
        });
      }
    },
    [config.page], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const vis = useMemo(
    () => Children.map(children, child => child && cloneElement(child, { data })),
    [children, data],
  );

  return (
    <Grid container spacing={4} className={classes.root}>
      <Grid item xs={12}><YearSelect /></Grid>
      <Grid item style={{ width: 400 }}><PageSelect /></Grid>
      <Grid item style={{ width: 'calc(100% - 400px)' }}>
        <Grid container direction="column" wrap="nowrap" spacing={1} style={{ width: 'calc(100% - 100px)' }}>
          <Grid item><ScenarioSelect multiSelect={multiSelectScenario} /></Grid>
          <Grid item><HorizontalControlBar /></Grid>
        </Grid>
      </Grid>
      <Grid item style={{ width: 100 }}>
        <LinkButtonGroup title="Context" labels={['about', 'methodology', 'report', 'results', 'assumptions']} />
      </Grid>
      <Grid item style={{ width: 'calc(100% - 100px)' }}>
        <Grid container wrap="nowrap" spacing={4}>
          {showSource && (
            <Grid item>
              <DraggableVerticalList
                title="Source"
                round
                disabled={disableDraggableSource}
                singleSelect={singleSelectSource}
                items={config.sources}
                itemOrder={config.sourceOrder}
                defaultItems={SOURCES}
                defaultItemOrder={config.page === 'electricty' ? ELECTRICITY_SOURCE_ORDER : SOURCE_ORDER}
                setItems={sources => setConfig({ ...config, sources })}
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
                items={config.provinces}
                itemOrder={config.provinceOrder}
                defaultItems={REGIONS}
                defaultItemOrder={REGION_ORDER}
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
