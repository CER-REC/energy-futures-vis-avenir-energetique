import React, { useState, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  makeStyles, createStyles, Grid, Button, Typography,
} from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import analytics from '../../analytics';

import useConfig from '../../hooks/useConfig';
import {
  LinkButtonContentReport, LinkButtonContentMethodology, LinkButtonContentAbout,
} from './contents';

const useStyles = makeStyles(theme => createStyles({
  title: {
    color: theme.palette.primary.main,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  btnContainer: {
    position: 'relative',
    width: '100%',
    lineHeight: 0,
  },
  btn: {
    height: 'auto',
    minHeight: 26,
    width: 102,
    minWidth: 0,
    padding: theme.spacing(0.25, 1),
    border: '1px solid transparent',
    fontSize: 13,
    letterSpacing: -0.25,
    textAlign: 'left',
    textTransform: 'initial',
    justifyContent: 'left',
  },
  popUp: {
    position: 'absolute',
    zIndex: theme.zIndex.modal,
    border: `1px solid ${theme.palette.secondary.light}`,
    color: theme.palette.secondary.main,
    backgroundColor: '#F3EFEF',
    overflow: 'auto',
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
  popUpRight: {
    top: 0,
    left: 'calc(100% + 20px)',
    transform: `translateY(calc(-100% + ${theme.spacing(8)}px))`,
    maxHeight: 350,
    minWidth: 350,
  },
  popUpTop: {
    bottom: 'calc(100% + 24px)',
    left: -16,
    maxHeight: 300,
    minWidth: 350,
  },
  tip: {
    position: 'absolute',
    border: `1px solid ${theme.palette.secondary.light}`,
    backgroundColor: '#F3EFEF',
    zIndex: theme.zIndex.modal + 1,
  },
  tipRight: {
    top: 0,
    bottom: 0,
    left: 'calc(100% + 4px)',
    width: 17,
    borderRight: 'none',
  },
  tipTop: {
    bottom: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    height: 22,
    borderTop: 'none',
  },
  accent: { borderLeft: `8px solid ${theme.palette.primary.main}` },
}));

const LinkButtonGroup = ({ direction }) => {
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
        <div className={`${classes.popUp} ${direction === 'row' ? classes.popUpTop : classes.popUpRight}`}>
          {label.content}
        </div>
        <div className={`${classes.tip} ${direction === 'row' ? classes.tipTop : classes.tipRight}`} />
      </span>
    </Grid>
  );

  return (
    <ClickAwayListener onClickAway={() => setSelect(undefined)}>
      <Grid
        container
        direction={direction}
        alignItems="flex-start"
        spacing={direction === 'row' ? 1 : 0}
      >
        {direction === 'column' && (
          <Grid item xs={12} style={{ marginBottom: 8 }}>
            <Typography variant="body1" color="primary" className={classes.title}>{intl.formatMessage({ id: 'links.title' })}</Typography>
          </Grid>
        )}
        <Grid item className={direction === 'row' ? '' : classes.accent}>{generateButton(link.report)}</Grid>
        {direction === 'column' && <Grid item style={{ height: 8 }} />}
        <Grid item className={direction === 'row' ? '' : classes.accent}>{generateButton(link.methodology)}</Grid>
        {direction === 'column' && <Grid item className={direction === 'row' ? '' : classes.accent} style={{ height: 8 }} />}
        <Grid item className={direction === 'row' ? '' : classes.accent}>{generateButton(link.about)}</Grid>
      </Grid>
    </ClickAwayListener>
  );
};

LinkButtonGroup.propTypes = { direction: PropTypes.string }; // 'row' or 'column'
LinkButtonGroup.defaultProps = { direction: 'column' };

export default LinkButtonGroup;
