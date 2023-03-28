import { useIntl } from 'react-intl';
import { Grid, Link, makeStyles, Typography, useMediaQuery } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import YearSelect from '../YearSelect';
import { Share } from '../Share';
import { PageSelect, PageTitle } from '../PageSelect';
import ScenarioSelect from '../ScenarioSelect';
import HorizontalControlBar from '../HorizontalControlBar';
import analytics from '../../analytics';
import useConfig from '../../hooks/useConfig';
import getPageIcon from '../../utilities/getPageIcon';

const useStyles = makeStyles(theme => ({
  row: {
    height: `calc(100% + ${theme.spacing(2)}px)`,
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
    padding: theme.spacing(1, 0),
    backgroundColor: '#F3EFEF',
  },
  icon: {
    padding: 0,
    '& > svg': {
      height: '100%',
      maxHeight: 132,
      width: 'auto',
      fill: '#CCC',
    },
  },
}));

const Header = ({ multiSelectScenario }) => {
  const classes = useStyles();
  const intl = useIntl();
  const desktop = useMediaQuery('(min-width: 992px)');

  const { config } = useConfig();

  /**
   * The main title, which can be reused in both desktop and mobile layouts.
   */
  const title = (
    <Link href="./" underline="none" onClick={() => analytics.reportNav('landing')} className={classes.title}>
      <Typography variant="h4" color="primary">{intl.formatMessage({ id: 'common.title' })}</Typography>
    </Link>
  );

  /**
   * The control panel, which is currently only used in mobile layouts.
   */
  const controls = (
    <Grid container direction="column" wrap="nowrap" className={classes.controls}>
      <Grid item><ScenarioSelect multiSelect={multiSelectScenario} /></Grid>
      <Grid item><HorizontalControlBar /></Grid>
    </Grid>
  );

  /**
   * Construct the header / controls based on the screen size.
   * Note: CER template uses custom breakpoints.
   */
  const desktopHeader = (
    <>
      {/* Row 1: main title; year select; */}
      <Grid item xs={12}>
        <Grid container alignItems="flex-end" wrap="nowrap" spacing={2}>
          <Grid item>{title}</Grid>
          {/* TODO: Year Select */}
          <div />
          <YearSelect hideTip />
        </Grid>
        <Typography variant="h6" style={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'components.header.subtitle' })}</Typography>
      </Grid>

      {/* Row 2: page select; scenario select and utility bar (stacked); social media links */}
      <Grid item xs={12}>
        <Grid container style={{ width: '100%' }} alignItems="center" wrap="nowrap" spacing={2} className={classes.row}>
          <Grid item className={classes.icon}>
            {getPageIcon(config.page)}
          </Grid>
          <Grid container className={classes.controls}>
            <Grid item style={{ width: '100%' }}>
              <ScenarioSelect multiSelect={multiSelectScenario} />
            </Grid>
          </Grid>
          <Grid item style={{ width: 40 }}><Share /></Grid>
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

  return desktop ? desktopHeader : tabletHeader;
};

Header.propTypes = {
  multiSelectScenario: PropTypes.bool,
};

Header.defaultProps = {
  multiSelectScenario: false,
};

export default Header;
