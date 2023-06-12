/* eslint-disable react/prop-types */
import React from 'react';
import { useIntl } from 'react-intl';
import {
  makeStyles, createStyles,
  Grid, ButtonBase, Typography, Tooltip,
} from '@material-ui/core';
import { PAGES } from '../../constants';
import useConfig from '../../hooks/useConfig';
import analytics from '../../analytics';
import PageIcon from '../PageIcon';

const DESKTOP_ICON_SIZE = 55;
const TABLET_ICON_SIZE = 35;

const useStyles = makeStyles(theme => createStyles({
  box: {
    width: '100%',
    zIndex: 9,
    border: `2px solid ${theme.palette.secondary.light}`,
    borderRadius: '8px 8px 0 0',
    borderBottom: 'none',
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
    '&:disabled': {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.main,
      '& svg': { fill: '#FEFEFE' },
      '& span': { color: '#FEFEFE' },
    },
  },
  icon: {
    [theme.breakpoints.up('md')]: {
      height: DESKTOP_ICON_SIZE,
      width: DESKTOP_ICON_SIZE,
    },
    [theme.breakpoints.down('md')]: {
      height: TABLET_ICON_SIZE,
      width: TABLET_ICON_SIZE,
    },
    '& > svg': {
      height: '100%',
      width: '100%',
      padding: '0.3em',
      fill: theme.palette.secondary.light,
      transition: 'fill .35s ease-in-out',
    },
    '& + span': {
      fontWeight: 700,
      color: theme.palette.secondary.light,
      transition: 'color .35s ease-in-out',
    },
  },
  tooltip: {
    margin: theme.spacing(0, 1),
    fontSize: 14,
    lineHeight: 1,
    color: '#999',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #AAA',
    borderRadius: 0,
    boxShadow: theme.shadows[1],
  },
  label: {
    textTransform: 'uppercase',
    [theme.breakpoints.up('md')]: {
      paddingLeft: '0.5em',
    },
  },
}));

const PageSelect = () => {
  const classes = useStyles();
  const intl = useIntl();

  const { config, configDispatch } = useConfig();

  const handlePageUpdate = page => () => {
    configDispatch({ type: 'page/changed', payload: page });
    analytics.reportNav(config.page, page);
  };

  const pageButtons = PAGES.filter(page => page.id !== 'landing').map((page) => {
    const subtitle = intl.formatMessage({ id: `components.pageSelect.${page.label}.title.default` });
    return (
      <Grid item key={`page-${page.id}`} style={{ width: '100%' }}>
        <Tooltip
          title={(
            <>
              <Typography variant="h6">{subtitle}</Typography>
              <Typography variant="caption" component="div" gutterBottom>
                {intl.formatMessage({ id: `components.pageSelect.${page.label}.description` })}
              </Typography>
            </>
          )}
          placement="right"
          classes={{ tooltip: classes.tooltip }}
        >
          <span>
            <ButtonBase
              disabled={page.id === config.page}
              aria-label={`${intl.formatMessage({ id: 'common.a11y.redirect' })} ${subtitle}`}
              onClick={handlePageUpdate(page.id)}
              classes={{ root: classes.box }}
            >
              <Grid container wrap="nowrap" alignItems="center" justify="center">
                <div className={classes.icon}><PageIcon id={page.id} /></div>
                <Typography variant="caption" className={classes.label}>{subtitle}</Typography>
              </Grid>
            </ButtonBase>
          </span>
        </Tooltip>
      </Grid>
    );
  });

  return (
    <Grid
      container
      wrap="nowrap"
      spacing={1}
      style={{ padding: '10px 10px 0 10px' }}
    >
      {pageButtons}
    </Grid>
  );
};

export default PageSelect;
