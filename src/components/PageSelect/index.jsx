/* eslint-disable react/prop-types */
import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  makeStyles, createStyles,
  Grid, ButtonBase, Typography, Tooltip,
} from '@material-ui/core';
import { PAGES } from '../../constants';
import useConfig from '../../hooks/useConfig';
import analytics from '../../analytics';
import PageIcon from '../PageIcon';

const useStyles = makeStyles(theme => createStyles({
  box: {
    height: 98,
    width: 72,
    backgroundColor: '#F3EFEF',
    boxShadow: theme.shadows[4],
    zIndex: 9,
    border: '2px solid transparent',
    transition: 'top .5s ease-in-out, padding .5s ease-in-out, border-color .25s ease-in-out',
    '&:hover': { border: `2px solid ${theme.palette.primary.main}` },
    '&:disabled': {
      backgroundColor: theme.palette.primary.main,
      boxShadow: theme.shadows[0],
      '& svg': { fill: '#FEFEFE' },
      '& span': { color: '#FEFEFE' },
    },

    '& > div': {
      width: 'auto',
    },
  },
  icon: {
    height: 64,
    width: 64,
    '& > svg': {
      height: 64,
      width: 64,
      fill: theme.palette.secondary.light,
      transition: 'fill .35s ease-in-out',
    },
    '& + span': {
      width: 64,
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
  shift: {
    marginTop: -theme.spacing(1.5),
    marginLeft: -theme.spacing(1),
  },
}));

const PageSelect = ({ direction /* row, column */ }) => {
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
      <Grid item key={`page-${page.id}`}>
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
              <Grid container direction="column" wrap="nowrap">
                <div className={classes.icon}><PageIcon id={page.id} /></div>
                <Typography variant="caption">{subtitle}</Typography>
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
      direction={direction}
      alignItems="center"
      wrap="nowrap"
      spacing={1}
      className={direction === 'row' ? '' : classes.shift}
    >
      {pageButtons}
    </Grid>
  );
};

PageSelect.propTypes = { direction: PropTypes.string };
PageSelect.defaultProps = { direction: 'column' };

export default PageSelect;
