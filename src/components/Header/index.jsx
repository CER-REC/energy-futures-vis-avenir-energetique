import { useIntl } from 'react-intl';
import { Grid, Link, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import YearSelect from '../YearSelect';
import Share from '../Share';
import { PageSelect, PageTitle } from '../PageSelect';
import ScenarioSelect from '../ScenarioSelect';
import HorizontalControlBar from '../HorizontalControlBar';
import analytics from '../../analytics';
import useConfig from '../../hooks/useConfig';
import useIsDesktop from '../../hooks/useIsDesktop';
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
  const isDesktop = useIsDesktop();

  const { config } = useConfig();
  const multiSelectScenario = config.page === 'scenarios';

  const title = (
    <Link href="./" underline="none" onClick={() => analytics.reportNav('landing')} className={classes.title}>
      <Typography variant="h4" color="primary">{intl.formatMessage({ id: 'common.title' })}</Typography>
    </Link>
  );

  // Note: CER template uses custom breakpoints.
  return (
    <>
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

      <Grid item xs={12} style={{ marginBottom: '0.3em' }}>
        <Grid container style={{ width: '100%' }} alignItems="center" wrap="nowrap" className={classes.row}>
          <Grid container className={classes.controls}>
            {
              isDesktop && (
                <Grid item xs={1} className={classes.icon}>
                  <PageIcon id={config.page} />
                </Grid>
              )
            }
            <Grid item md={11} xs={12} style={{ width: '100%' }}>
              <ScenarioSelect multiSelect={multiSelectScenario} />
            </Grid>
          </Grid>
          { isDesktop && (
            <Grid item style={{ marginLeft: '0.3em' }}><Share /></Grid>
          )}
        </Grid>
      </Grid>

      {
        isDesktop && (
        <Grid item style={{ width: 100 }}><PageSelect /></Grid>
      )}
    </>
  );
};

export default Header;
