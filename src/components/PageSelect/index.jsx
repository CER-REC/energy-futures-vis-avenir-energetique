/* eslint-disable react/prop-types */
import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  makeStyles, createStyles,
  Grid, ButtonBase, Typography, Tooltip,
} from '@material-ui/core';
import { PAGES } from '../../constants';
import useConfig from '../../hooks/useConfig';

import {
  IconPageRegion, IconPageSector, IconPageElectricity, IconPageScenarios, IconPageOilAndGas,
} from '../../icons';

const getPageIcon = (id) => {
  switch (id) {
    case 'by-region': return <IconPageRegion />;
    case 'by-sector': return <IconPageSector />;
    case 'electricity': return <IconPageElectricity />;
    case 'scenarios': return <IconPageScenarios />;
    case 'oil-and-gas': return <IconPageOilAndGas />;
    default: return null;
  }
};

const useStyles = makeStyles(theme => createStyles({
  title: {
    position: 'relative',
    height: '100%',
    width: '100%',
    backgroundColor: '#F3EFEF',
    overflow: 'hidden',
    '& > svg': {
      position: 'absolute',
      top: '50%',
      left: '-4%',
      height: '120%',
      maxHeight: 132,
      width: 'auto',
      fill: '#CCC',
      transform: 'translateY(-50%)',
    },
    '& > h5': { margin: theme.spacing(1, 2, 1, 15) },
  },

  box: {
    height: 84,
    width: 72,
    backgroundColor: '#F3EFEF',
    boxShadow: theme.shadows[4],
    zIndex: 9,
    border: '2px solid transparent',
    transition: 'top .5s ease-in-out, padding .5s ease-in-out, border-color .25s ease-in-out',
    '&:hover': { border: `2px solid ${theme.palette.primary.main}` },

    '& > div': {
      width: 'auto',
      '& > span': { whiteSpace: 'nowrap' },
    },
  },
  icon: {
    height: 64,
    width: 64,
    '& > svg': {
      height: 64,
      width: 64,
      fill: theme.palette.secondary.light,
    },
    '& + span': {
      width: 64,
      color: theme.palette.secondary.light,
      fontWeight: 700,
    },
  },
  label: {
    textAlign: 'left',
    overflow: 'hidden',
    transition: 'height .5s ease-in-out, width .5s ease-in-out',
    '& > h5': {
      marginLeft: theme.spacing(2),
      transition: 'opacity .5s ease-in-out',
    },
    '& > h5:first-of-type': { fontWeight: 700 },
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
}));

export const PageTitle = () => {
  const classes = useStyles();
  const intl = useIntl();

  const { config } = useConfig();

  /**
   * Generate the translation of the selected page title.
   */
  const getTitle = useCallback((page) => {
    switch (page.id) {
      case 'by-region':
        return intl.formatMessage({
          id: `components.pageSelect.${page.label}.title.${config.mainSelection}`,
          defaultMessage: intl.formatMessage({ id: `components.pageSelect.${page.label}.title.default` }),
        });
      case 'by-sector':
        return intl.formatMessage({
          id: `components.pageSelect.${page.label}.title.${config.sector}`,
          defaultMessage: intl.formatMessage({ id: `components.pageSelect.${page.label}.title.default` }),
        });
      case 'electricity':
        return intl.formatMessage({
          id: `components.pageSelect.${page.label}.title.${config.view}`,
          defaultMessage: intl.formatMessage({ id: `components.pageSelect.${page.label}.title.default` }),
        });
      case 'scenarios':
        return intl.formatMessage({
          id: `components.pageSelect.${page.label}.title.${config.mainSelection}`,
          defaultMessage: intl.formatMessage({ id: `components.pageSelect.${page.label}.title.default` }),
        });
      case 'oil-and-gas':
        return intl.formatMessage({
          id: `components.pageSelect.${page.label}.title.${config.mainSelection}.${config.view}`,
          defaultMessage: intl.formatMessage({ id: `components.pageSelect.${page.label}.title.default` }),
        });
      default: return page?.label;
    }
  }, [intl, config.mainSelection, config.sector, config.view]);

  return (
    <Grid container alignItems="center" wrap="nowrap" className={classes.title}>
      {getPageIcon(config.page)}
      <Typography variant="h5" color="secondary">
        {getTitle(PAGES.find(page => page.id === config.page))}
      </Typography>
    </Grid>
  );
};

export const PageSelect = ({ direction /* row, column */ }) => {
  const classes = useStyles();
  const intl = useIntl();

  const { config, configDispatch } = useConfig();

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
              onClick={() => configDispatch({ type: 'page/changed', payload: page.id })}
              classes={{ root: classes.box }}
            >
              <Grid container direction="column" wrap="nowrap">
                <div className={classes.icon}>{getPageIcon(page.id)}</div>
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
      style={{ height: '100%', marginTop: direction === 'row' ? 0 : -12 }}
    >
      {pageButtons}
    </Grid>
  );
};

PageSelect.propTypes = { direction: PropTypes.string };
PageSelect.defaultProps = { direction: 'column' };
