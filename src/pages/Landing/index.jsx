import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import {
  makeStyles, useMediaQuery,
  Grid, ButtonBase, Button, Fab, Typography, Dialog, DialogContent,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Markdown from 'react-markdown';
import { PAGES } from '../../constants';
import useConfig from '../../hooks/useConfig';

import { IconDownload, IconExternal } from '../../icons';
import headerBg from './header.jpg';
import portalByRegion from './portal_by_region.jpg';
import portalBySector from './portal_by_sector.jpg';
import portalElectricity from './portal_electricity.jpg';
import portalScenarios from './portal_scenarios.jpg';
import portalOilAndGas from './portal_oil_and_gas.jpg';
import portalDemand from './portal_demand.jpg';
import reportCover from './report_cover.jpg';

const useStyles = makeStyles(theme => ({
  header: {
    position: 'relative',
    width: '100%',
    margin: theme.spacing(3, 0),
    '& > img': { width: '100%' },
  },
  aside: {
    float: 'left',
    '& h6, & button, & a': {
      fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
    },
  },
  main: {
    marginBottom: theme.spacing(8),
    '& h6, & p, & span, & button, & a': {
      fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
    },
  },
  title: {
    position: 'absolute',
    left: '8%',
    top: '50%',
    maxWidth: '27%',
    color: theme.palette.common.white,
    fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
    transform: 'translateY(-50%)',
  },

  box: {
    width: '100%',
    boxShadow: theme.shadows[0],
    backgroundSize: 'cover',
    backgroundPosition: '50% 50%',
    overflow: 'hidden',
    transition: 'box-shadow .25s ease-in-out',
    textAlign: 'left',
    '&:hover': { boxShadow: theme.shadows[6] },
    '& > img': {
      width: '100%',
      transition: 'transform 1s ease-in-out',
    },
    '&:hover > img': {
      transition: 'transform 10s linear',
      transform: 'scale(1.75)',
    },
    '& > img + div': {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(103, 142, 179, 1)',
      opacity: 1,
      transition: 'background-color .35s ease-in-out',
    },
    '&:hover > img + div': {
      backgroundColor: 'rgba(103, 142, 179, .75)',
    },
    '& h6, & p': {
      padding: theme.spacing(1, 1.5, 1.5),
      color: theme.palette.getContrastText(theme.palette.primary.dark),
      lineHeight: 1.1,
    },
  },
  boxDesktop: {
    '& p': {
      height: 0,
      padding: theme.spacing(0, 1.5),
      transition: 'height .35s ease-in-out, padding .35s ease-in-out',
    },
    '&:hover p': { height: 64 },
  },

  links: {
    '& > div:first-of-type': {
      width: theme.spacing(1),
      backgroundColor: theme.palette.primary.main,
    },
    '& > div:last-of-type': { width: 'calc(100% - 8px)' },
    '& button, & a': {
      height: 'auto',
      minHeight: 38,
      width: '100%',
      justifyContent: 'flex-start',
      '& > span:first-of-type': { fontSize: 16 },
    },
    '& button, & a, & a:hover, & a:focus, & a:active, & a:visited': {
      color: theme.palette.secondary.main,
      textDecoration: 'none',
    },
  },
  download: {
    '& > h6': {
      maxWidth: 250,
      lineHeight: 1,
      fontWeight: 700,
    },
    '& img': {
      width: '100%',
      margin: theme.spacing(2, 0),
      border: `1px solid ${theme.palette.secondary.main}`,
      boxShadow: theme.shadows[3],
      transition: 'box-shadow .25s ease-in-out',
      '&:hover': { boxShadow: theme.shadows[6] },
    },
    '& > button, & > a': {
      height: 'auto',
      width: '100%',
    },
    '& > a > span:first-of-type': { justifyContent: 'normal' },
  },

  dialog: {
    overflow: 'visible',
    '& p, & ul': { margin: theme.spacing(0, 0, 1) },
  },
  close: {
    position: 'absolute',
    top: -24,
    right: -24,
    zIndex: 1,
  },
}));

const getBg = (page) => {
  switch (page) {
    case 'by-region': return portalByRegion;
    case 'by-sector': return portalBySector;
    case 'electricity': return portalElectricity;
    case 'scenarios': return portalScenarios;
    case 'oil-and-gas': return portalOilAndGas;
    case 'demand': default: return portalDemand;
  }
};

const Landing = () => {
  const classes = useStyles();
  const intl = useIntl();

  const { configDispatch } = useConfig();
  const [open, setDialog] = useState(false); // for the 'about' dialog

  /**
   * CER template uses a custom breakpoint.
   */
  const desktop = useMediaQuery('(min-width: 992px)');

  const handleRedirect = page => () => configDispatch({ type: 'page/changed', payload: page });

  return (
    <>
      <header className={classes.header}>
        <img src={headerBg} alt="header background" />
        <Typography variant={desktop ? 'h4' : 'h5'} className={classes.title}>{intl.formatMessage({ id: 'landing.title' })}</Typography>
      </header>

      <aside className={classes.aside} style={{ width: desktop ? '20%' : '30%' }}>
        <Grid container direction="column" wrap="nowrap" spacing={desktop ? 6 : 3}>

          {/* link buttons (about, methodology, and student resources) */}
          <Grid item>
            <Grid container wrap="nowrap" className={classes.links}>
              <Grid item />
              <Grid item>
                <Grid container direction="column" wrap="nowrap" spacing={2}>
                  {[
                    { name: intl.formatMessage({ id: 'links.About.title' }), action: () => setDialog(true) },
                    { name: intl.formatMessage({ id: 'landing.links.methodology.title' }), link: intl.formatMessage({ id: 'landing.links.methodology.link' }) },
                    { name: intl.formatMessage({ id: 'landing.links.resources.title' }), link: intl.formatMessage({ id: 'landing.links.resources.link' }) },
                  ].map(entry => (
                    <Grid item key={`landing-link-button-${entry.name}`}>
                      <Button variant="contained" color="secondary" href={entry.link} target="_about" onClick={entry.action}>{entry.name}</Button>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* the download report thumbnail and links */}
          <Grid item className={classes.download}>
            <Typography variant="h6" color="secondary">{intl.formatMessage({ id: 'landing.links.title' })}</Typography>
            <ButtonBase href={intl.formatMessage({ id: 'landing.links.download.link' })} target="_about">
              <img src={reportCover} alt="download report link" />
            </ButtonBase>
            <Button color="primary" startIcon={<IconDownload />} href={intl.formatMessage({ id: 'landing.links.download.link' })} target="_about">
              {intl.formatMessage({ id: 'landing.links.download.title' })}
            </Button>
            <Button color="primary" startIcon={<IconExternal />} href={intl.formatMessage({ id: 'landing.links.view.link' })} target="_about">
              {intl.formatMessage({ id: 'landing.links.view.title' })}
            </Button>
          </Grid>
        </Grid>
      </aside>

      <main className={classes.main} style={{ width: desktop ? '75%' : '65%', marginLeft: desktop ? '25%' : '35%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ maxWidth: 600 }}>{intl.formatMessage({ id: 'landing.description' })}</Typography>
          </Grid>

          {PAGES.map(page => page.id !== 'landing' && (
            <Grid key={`landing-box-${page.id}`} item xs={desktop ? 6 : 12}>
              <ButtonBase onClick={handleRedirect(page.id)} className={`${classes.box} ${desktop ? classes.boxDesktop : ''}`.trim()}>
                <img src={getBg(page.id)} alt={`cover for the redirect link to page ${page.label}`} />
                <div>
                  <Typography variant="h6">{intl.formatMessage({ id: `landing.${page.label}.title` })}</Typography>
                  <Typography variant="body2" component="p">{intl.formatMessage({ id: `landing.${page.label}.description` })}</Typography>
                </div>
              </ButtonBase>
            </Grid>
          ))}
        </Grid>
      </main>

      {/* the about dialog */}
      <Dialog open={open} onClose={() => setDialog(false)} classes={{ paper: classes.dialog }}>
        <Fab color="primary" size="medium" onClick={() => setDialog(false)} className={classes.close}><CloseIcon /></Fab>
        <DialogContent style={{ padding: 24 }}>
          <Markdown>{intl.formatMessage({ id: 'about' })}</Markdown>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Landing;
