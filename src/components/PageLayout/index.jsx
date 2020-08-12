/* eslint-disable import/no-cycle */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import YearSelect from '../YearSelect';
import PageSelect from '../PageSelect';
import ScenarioSelect from '../ScenarioSelect';
import DraggableVerticalList from '../DraggableVerticalList';
import HorizontalControlBar from '../HorizontalControlBar';

import { ConfigContext } from '../../utilities/configContext';
import { REGIONS, REGION_ORDER, SOURCES, SOURCE_ORDER } from '../../types';

const PageLayout = ({
  children,
  showRegion = false /* boolean */,
  showSource = false /* boolean */,
  disableDraggableRegion = false /* boolean */,
  disableDraggableSource = false /* boolean */,
  singleSelectRegion = false /* boolean */,
  singleSelectSource = false /* boolean */,
}) => {
  const classes = useStyles();

  const { config, setConfig } = useContext(ConfigContext);

  return (
    <Grid container spacing={4} className={classes.root}>
      <Grid item xs={12}><YearSelect /></Grid>
      <Grid item style={{ width: 400 }}><PageSelect /></Grid>
      <Grid item style={{ width: 'calc(100% - 400px)' }}>
        <Grid container direction="column" wrap="nowrap" spacing={1}>
          <Grid item><ScenarioSelect /></Grid>
          <Grid item><HorizontalControlBar /></Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ marginLeft: 100 }}>
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
                defaultItemOrder={SOURCE_ORDER}
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
          {children && <Grid item className={classes.graph}>{children}</Grid>}
        </Grid>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4, 0),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
  graph: {
    flexGrow: 1,
    height: 700,
  },
}));

export default PageLayout;
