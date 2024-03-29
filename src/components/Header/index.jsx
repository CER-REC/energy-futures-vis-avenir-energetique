import { useIntl } from 'react-intl';
import { Button, Grid, Link, makeStyles, Typography } from '@material-ui/core';
import React, { useCallback, useMemo } from 'react';
import PageSelect from '../PageSelect';
import ScenarioSelect from '../ScenarioSelect';
import analytics from '../../analytics';
import useConfig from '../../hooks/useConfig';
import useIsDesktop from '../../hooks/useIsDesktop';
import DropDown from '../Dropdown';
import { HintScenarioSelect, HintYearSelect } from '../Hint';
import useAPI from '../../hooks/useAPI';
import HorizontalControlBar from '../HorizontalControlBar';

const useStyles = makeStyles(theme => ({
  row: {
    marginBottom: '0.3em',
    backgroundColor: theme.palette.background.light,
    borderTop: `3px solid ${theme.palette.secondary.light}`,
    padding: theme.spacing(1),
  },
  title: {
    'a&:hover': { textDecoration: 'none' },
    '& > h4': {
      fontWeight: 700,
      textTransform: 'uppercase',
    },
  },
  yearSelectContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));

const Header = () => {
  const classes = useStyles();
  const intl = useIntl();
  const isDesktop = useIsDesktop();
  const { yearIdIterations } = useAPI();

  const yearIds = useMemo(
    () => Object.keys(yearIdIterations).sort().reverse(),
    [yearIdIterations],
  );

  const { config, configDispatch } = useConfig();
  const multiSelectScenario = config.page === 'scenarios';

  const handleYear = useCallback((yearId) => {
    configDispatch({ type: 'yearId/changed', payload: yearId });
    analytics.reportFeature(config.page, 'year', yearId);
  }, [configDispatch, config.page]);

  const title = (
    <Link href="./" underline="none" onClick={() => analytics.reportNav(config.page, 'landing')} className={classes.title}>
      <Typography variant="h4" color="primary">{intl.formatMessage({ id: 'common.title' })}</Typography>
    </Link>
  );

  // Note: CER template uses custom breakpoints.
  return (
    <>
      <Grid container>
        <Grid item style={{ flex: 1 }}>{title}</Grid>
        <Grid item className={classes.yearSelectContainer}>
          <Typography variant="subtitle1">{intl.formatMessage({ id: 'components.yearSelect.name' })}</Typography>
          <HintYearSelect />
          <DropDown
            options={yearIds.map(yearId => [intl.formatMessage({ id: `components.yearSelect.${yearId}.dropdown`, defaultMessage: yearId }), yearId])}
            value={config.yearId}
            onChange={handleYear}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item style={{ flex: 1 }}>
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'components.header.subtitle' })}</Typography>
          {
            isDesktop && (
              <>
                <Typography>{intl.formatMessage({ id: `components.scenarioSelect.description.${config.yearId}` })}</Typography>
                <HintScenarioSelect isTextButton>
                  <Button variant="text" color="primary">{intl.formatMessage({ id: 'components.header.learnMore' })}</Button>
                </HintScenarioSelect>
              </>
            )
          }
        </Grid>
      </Grid>

      <PageSelect />

      <Grid
        container
        className={classes.row}
      >
        <Grid item xs={12}>
          <ScenarioSelect
            multiSelect={multiSelectScenario}
          />
        </Grid>
        <Grid item xs={12}>
          <HorizontalControlBar />
        </Grid>
      </Grid>
    </>
  );
};

export default Header;
