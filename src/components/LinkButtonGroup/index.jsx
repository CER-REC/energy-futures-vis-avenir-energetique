import React, { useState, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import {
  makeStyles, createStyles, Grid, Button,
} from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import analytics from '../../analytics';

import useConfig from '../../hooks/useConfig';
import {
  LinkButtonContentReport, LinkButtonContentMethodology, LinkButtonContentAbout,
} from './contents';
import DownloadButton from '../DownloadButton';

const useStyles = makeStyles(theme => createStyles({
  title: {
    color: theme.palette.primary.main,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  btnContainer: {
    position: 'relative',
    lineHeight: 0,
  },
  btn: {
    ...theme.mixins.contextButton,
  },
  popUp: {
    position: 'absolute',
    zIndex: theme.zIndex.modal,
    border: `1px solid ${theme.palette.secondary.light}`,
    color: theme.palette.secondary.main,
    backgroundColor: '#F3EFEF',
    overflow: 'auto',
    bottom: 'calc(100% + 24px)',
    left: -16,
    maxHeight: 250,
    minWidth: 350,
    '& *': { fontFamily: '"FiraSansCondensed", "Roboto", "Helvetica", "Arial", sans-serif' },
    '& h4': { marginTop: 0 },
    '& p, & li': {
      fontSize: 12,
      lineHeight: 1.1,
      '&:not(.MuiTypography-root)': { marginBottom: 0 },
    },
    '& li': { margin: theme.spacing(0.5, 0) },
    '& img': {
      width: '100%',
      border: `1px solid ${theme.palette.secondary.light}`,
    },
  },
  tip: {
    position: 'absolute',
    border: `1px solid ${theme.palette.secondary.light}`,
    backgroundColor: '#F3EFEF',
    zIndex: theme.zIndex.modal + 1,
    bottom: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    height: 22,
    borderTop: 'none',
  },
  accent: { ...theme.mixins.contextAccent },
}));

const LinkButtonGroup = () => {
  const classes = useStyles();
  const intl = useIntl();

  const { config } = useConfig();
  const [select, setSelect] = useState(undefined);

  const handleSelect = useCallback(label => () => {
    if (select !== label.name) {
      setSelect(label.name);
      analytics.reportMisc(config.page, 'click', label.tag);
    }
  }, [config.page, select]);

  const handleClose = useCallback(tag => () => {
    setSelect(undefined);
    analytics.reportMisc(config.page, 'click', `close ${tag}`);
  }, [setSelect, config.page]);

  const link = useMemo(() => ({
    report: {
      tag: 'report',
      name: intl.formatMessage({
        id: `links.Report.title.${config.yearId}`,
        defaultMessage: intl.formatMessage({ id: 'links.Report.title.default' }),
      }),
      content: <LinkButtonContentReport yearId={config.yearId} onClose={handleClose('report')} />,
    },
    methodology: {
      tag: 'methodology',
      name: intl.formatMessage({ id: 'links.Methodology.title' }),
      content: <LinkButtonContentMethodology onClose={handleClose('methodology')} />,
    },
    about: {
      tag: 'about',
      name: intl.formatMessage({ id: 'links.About.title' }),
      content: <LinkButtonContentAbout onClose={handleClose('about')} />,
    },
  }), [intl, config.yearId, handleClose]);

  /**
   * This is a button group in which buttons share the same accent color bar.
   */
  const generateButton = label => (
    <Grid item key={`link-button-${label.name}`} className={classes.btnContainer}>
      <Button
        variant="contained"
        color={select === label.name ? 'primary' : 'secondary'}
        aria-label={label.name}
        onClick={handleSelect(label)}
        className={classes.btn}
      >
        {label.name}
      </Button>

      <span id={`panel-button-${label.tag}`} style={{ display: select === label.name ? 'block' : 'none' }}>
        <div className={classes.popUp}>
          {label.content}
        </div>
        <div className={classes.tip} />
      </span>
    </Grid>
  );

  return (
    <ClickAwayListener onClickAway={() => setSelect(undefined)}>
      <Grid
        container
        alignItems="flex-start"
        spacing={1}
      >
        <Grid item>{generateButton(link.report)}</Grid>
        <Grid item className={classes.btnContainer}><DownloadButton /></Grid>
        <Grid item>{generateButton(link.methodology)}</Grid>
        <Grid item>{generateButton(link.about)}</Grid>
      </Grid>
    </ClickAwayListener>
  );
};

export default LinkButtonGroup;
