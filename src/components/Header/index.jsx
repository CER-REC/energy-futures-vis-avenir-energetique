import { useIntl } from 'react-intl';
import { Grid, Link, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import YearSelect from '../YearSelect';
import { Share } from '../Share';
import { PageSelect, PageTitle } from '../PageSelect';
import ScenarioSelect from '../ScenarioSelect';
import HorizontalControlBar from '../HorizontalControlBar';
import analytics from '../../analytics';
import useConfig from '../../hooks/useConfig';
import useGetIsDesktop from '../../hooks/useGetIsDesktop';
import PageIcon from '../PageIcon';

const useStyles = makeStyles(theme => ({
  row: {
    '& > div': { height: '100%' },
  },
  title: {
    'a&:hover': { textDecoration: 'none' },
    '& > h4': {
      fontWeight: 700,
      textTransform: 'uppercase',
    },
  },
  controls: {
    height: '100%',
    width: '100%',
    padding: theme.spacing(1, 0, 2, 2),
    backgroundColor: '#F3EFEF',
  },
  shareControl: {
    width: '4%',
    padding: theme.spacing(0, 1),
    backgroundColor: '#F3EFEF',
  },
  icon: {
    '& > svg': {
      height: '100%',
      maxHeight: 132,
      width: '100%',
      fill: '#CCC',
    },
  },
}));

const Header = () => {
  const classes = useStyles();
  const intl = useIntl();
  const isDesktop = useGetIsDesktop();

  const { config } = useConfig();
  const multiSelectScenario = config.page === 'scenarios';

  const title = (
    <Link href="./" underline="none" onClick={() => analytics.reportNav('landing')} className={classes.title}>
      <Typography variant="h4" color="primary">{intl.formatMessage({ id: 'common.title' })}</Typography>
    </Link>
  );

  const controls = (
    <Grid container direction="column" wrap="nowrap" className={classes.controls}>
      <Grid item><ScenarioSelect multiSelect={multiSelectScenario} /></Grid>
      <Grid item><HorizontalControlBar /></Grid>
    </Grid>
  );

  // Note: CER template uses custom breakpoints.
  const desktopHeader = (
    <>
      {/* Row 1: main title; year select; */}
      <Grid item xs={12}>
        <Grid container alignItems="flex-end" wrap="nowrap" spacing={2}>
          <Grid item xs={10}>{title}</Grid>
          <Grid item xs={2} style={{ textAlign: 'right' }}>
            {/* TODO: Year Select */}
            <div />
          </Grid>
        </Grid>
        <Typography variant="h6" style={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'components.header.subtitle' })}</Typography>
      </Grid>

      {/* Row 2: page select; scenario select and utility bar (stacked); social media links */}
      <Grid item xs={12} style={{ marginBottom: '0.3em' }}>
        <Grid container style={{ width: '100%' }} alignItems="center" wrap="nowrap" className={classes.row}>
          <Grid container className={classes.controls}>
            <Grid item xs={1} className={classes.icon}>
              <PageIcon id={config.page} />
            </Grid>
            <Grid item xs={11} style={{ width: '100%' }}>
              <ScenarioSelect multiSelect={multiSelectScenario} />
            </Grid>
          </Grid>
          <Grid item style={{ marginLeft: '0.3em' }} className={classes.shareControl}><Share /></Grid>
        </Grid>
      </Grid>

      {/* Row 3: link buttons (at bottom); vertical draggable lists; visualization */}
      <Grid item style={{ width: 100 }}><PageSelect /></Grid>
    </>
  );

  const tabletHeader = (
    <>
      <Grid item xs={12}>{title}</Grid>
      <Grid item xs={12}><YearSelect hideTip /></Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center" wrap="nowrap" spacing={2} className={classes.row}>
          <Grid item><PageTitle /></Grid>
          <Grid item style={{ height: '100%' }}><PageSelect direction="row" /></Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>{controls}</Grid>
    </>
  );

  return isDesktop ? desktopHeader : tabletHeader;
};

export default Header;
