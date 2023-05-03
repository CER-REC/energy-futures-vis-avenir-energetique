import { useIntl } from 'react-intl';
import { Grid, Link, makeStyles, Typography } from '@material-ui/core';
import React, { useCallback, useMemo } from 'react';
import Share from '../Share';
import PageSelect from '../PageSelect';
import ScenarioSelect from '../ScenarioSelect';
import analytics from '../../analytics';
import useConfig from '../../hooks/useConfig';
import useIsDesktop from '../../hooks/useIsDesktop';
import PageIcon from '../PageIcon';
import LinkButtonGroup from '../LinkButtonGroup';
import DropDown from '../Dropdown';
import { HintYearSelect } from '../Hint';
import useAPI from '../../hooks/useAPI';

const useStyles = makeStyles(theme => ({
  row: {
    width: '100%',
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
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0, 1),
      padding: theme.spacing(0, 1, 1, 1),
    },
  },
  icon: {
    '& > svg': {
      height: '100%',
      maxHeight: 132,
      width: '100%',
      fill: '#CCC',
    },
  },
  pageSelectContainer: {
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0, 1),
    },
    [theme.breakpoints.up('md')]: {
      marginRight: '0.15em',
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
    <Link href="./" underline="none" onClick={() => analytics.reportNav('landing')} className={classes.title}>
      <Typography variant="h4" color="primary">{intl.formatMessage({ id: 'common.title' })}</Typography>
    </Link>
  );
  const yearSelect = (
    <Grid item className={classes.yearSelectContainer}>
      <Typography variant="body1" color="secondary">{intl.formatMessage({ id: 'components.yearSelect.name' })}</Typography>
      <DropDown
        options={yearIds.map(yearId => [intl.formatMessage({ id: `components.yearSelect.${yearId}.dropdown`, defaultMessage: yearId }), yearId])}
        value={config.yearId}
        onChange={handleYear}
      />
      <HintYearSelect />
    </Grid>
  );

  // Note: CER template uses custom breakpoints.
  return (
    <>
      <Grid container item xs={12}>
        <Grid item style={{ flex: 1 }}>{title}</Grid>
        {
          isDesktop && yearSelect
        }
      </Grid>
      <Grid container item xs={12}>
        <Grid item style={{ flex: 1 }}>
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'components.header.subtitle' })}</Typography>
        </Grid>
        {
          !isDesktop && yearSelect
        }
      </Grid>

      <Grid item xs={12} style={{ marginBottom: '0.3em' }}>
        <Grid container alignItems="center" wrap="nowrap" className={classes.row}>
          <Grid container className={classes.controls}>
            {
              isDesktop && (
                <Grid item xs={1} className={classes.icon}>
                  <PageIcon id={config.page} />
                </Grid>
              )
            }
            <Grid item md={11} xs={12}>
              <ScenarioSelect multiSelect={multiSelectScenario} />
            </Grid>
          </Grid>
          { isDesktop && (
            <Grid item style={{ marginLeft: '0.3em' }}><Share /></Grid>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12} md={1} className={classes.pageSelectContainer}>
        <PageSelect direction={isDesktop ? 'column' : 'row'} />
        {
          isDesktop && (
            <LinkButtonGroup direction='column' />
          )
        }
      </Grid>
    </>
  );
};

export default Header;
