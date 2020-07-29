/* eslint-disable import/no-cycle */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import YearSelect from '../YearSelect';
import ControlHorizontal from '../ControlHorizontal';
import DraggableVerticalList from '../DraggableVerticalList';
import HorizontalControlBar from '../HorizontalControlBar';

import { ConfigContext } from '../../containers/App/lazy';
import { REGIONS, REGION_ORDER, SOURCES, SOURCE_ORDER } from '../../types';

const PageLayout = ({
  children,
  showRegion = true /* boolean */,
  showSource = true /* boolean */,
}) => {
  const classes = useStyles();

  const { config, setConfig } = useContext(ConfigContext);

  return (
    <Grid container direction="column" spacing={4} className={classes.root}>
      <Grid item><YearSelect /></Grid>
      <Grid item><ControlHorizontal /></Grid>
      <Grid item>
        <Grid container wrap="nowrap" spacing={2}>

          {showRegion && (
            <Grid item>
              <DraggableVerticalList
                title="Region"
                left
                dense
                items={config.provinces}
                itemOrder={config.provinceOrder}
                defaultItems={REGIONS}
                defaultItemOrder={REGION_ORDER}
                setItems={provinces => setConfig({ ...config, provinces })}
                setItemOrder={provinceOrder => setConfig({ ...config, provinceOrder })}
              />
            </Grid>
          )}
          {showSource && (
            <Grid item>
              <DraggableVerticalList
                title="Source"
                round
                items={config.sources}
                itemOrder={config.sourceOrder}
                defaultItems={SOURCES}
                defaultItemOrder={SOURCE_ORDER}
                setItems={sources => setConfig({ ...config, sources })}
                setItemOrder={sourceOrder => setConfig({ ...config, sourceOrder })}
              />
            </Grid>
          )}
          <Grid container direction='column'>
            <HorizontalControlBar />

            {children && <Grid item className={classes.graph}>{children}</Grid>}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4, 0),
    backgroundColor: theme.palette.background.paper,
  },
  graph: {
    flexGrow: 1,
    height: 700,
  },
}));

export default PageLayout;
