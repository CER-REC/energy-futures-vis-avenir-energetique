/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
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

// eslint-disable-next-line no-nested-ternary
const toFront = (pages, id) => (pages.sort((a, b) => (a.id === id ? -1 : (b.id === id ? 1 : 0))));

const useStyles = makeStyles(theme => createStyles({
  root: { position: 'relative' },
  box: {
    position: 'absolute',
    left: 0,
    height: 84,
    backgroundColor: '#F3EFEF',
    boxShadow: theme.shadows[4],
    zIndex: 9,
    border: '2px solid transparent',
    transition: 'top .5s ease-in-out, padding .5s ease-in-out, border-color .25s ease-in-out',
    '&:hover': { border: `2px solid ${theme.palette.primary.main}` },
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

const PageSelect = () => {
  const classes = useStyles();
  const intl = useIntl();

  const { config, setConfig } = useConfig();

  const [pages, setPages] = useState(PAGES.filter(page => page.id !== 'landing'));
  const [loading, setLoading] = useState(false);

  /**
   * Auto-sync the selected page.
   */
  useEffect(
    () => {
      if (config.page !== pages[0]) {
        toFront(pages, config.page);
      }
    },
    [config.page], // eslint-disable-line react-hooks/exhaustive-deps
  );

  /**
   * Generate the translation of the selected page title.
   */
  const getTitle = useCallback((page) => {
    switch (page.id) {
      case 'by-region': return intl.formatMessage({ id: `components.pageSelect.${page.label}.title.${config.mainSelection}` });
      case 'by-sector': return intl.formatMessage({ id: `components.pageSelect.${page.label}.title.${config.sector}` });
      case 'electricity': return intl.formatMessage({ id: `components.pageSelect.${page.label}.title.${config.view}` });
      case 'scenarios': return intl.formatMessage({ id: `components.pageSelect.${page.label}.title.${config.mainSelection}` });
      case 'Oil-and-Gas': return intl.formatMessage({ id: `components.pageSelect.${page.label}.title.${config.mainSelection}` });
      default: return page.label;
    }
  }, [intl, config.mainSelection, config.sector, config.view]);

  const handleSelect = (id) => {
    if (loading || id === config.page) {
      return;
    }
    setLoading(true);
    setPages(toFront([...pages], id));
    // TODO: Changing pages can cause a 400 GraphQL error due to providing invalid sources
    // This can be fixed when implementing a reducer for the config,
    // since the correct set of sources is set at the same time
    setConfig({ ...config, page: id });
    setTimeout(() => setLoading(false), 800);
  };

  const pageButtons = PAGES.filter(page => page.id !== 'landing').map((page) => {
    const index = pages.findIndex(p => p.id === page.id) || 0;
    return (
      <Tooltip
        key={`page-${page.id}`}
        title={(
          <>
            <Typography variant="h6">{page.label}</Typography>
            <Typography variant="caption" component="div" gutterBottom>
              {intl.formatMessage({ id: `components.pageSelect.${page.label}.description` })}
            </Typography>
          </>
        )}
        placement="right"
        classes={{ tooltip: classes.tooltip }}
      >
        <ButtonBase
          centerRipple
          disableRipple={index === 0}
          disableTouchRipple={index === 0}
          onClick={() => handleSelect(page.id)}
          classes={{ root: classes.box }}
          style={{
            top: index === 0 ? 10 : (index - 1) * 88 + 82,
            height: index === 0 ? 68 : 84,
            cursor: index === 0 ? 'default' : 'pointer',
          }}
        >
          <Grid container direction="column" wrap="nowrap" style={{ width: 'auto' }}>
            <div className={classes.icon}>{getPageIcon(page.id)}</div>
            {index !== 0 && <Typography variant="caption">{page.label}</Typography>}
          </Grid>
          <div
            className={classes.label}
            style={{
              height: index === 0 ? 60 : 0,
              width: index === 0 ? 300 : 0,
            }}
          >
            <Typography variant="h5" color="primary" style={{ opacity: index === 0 ? 1 : 0 }}>
              {getTitle(page)}
            </Typography>
          </div>
        </ButtonBase>
      </Tooltip>
    );
  });

  return (
    <Grid container alignItems="center" wrap="nowrap" className={classes.root}>
      {pageButtons}
    </Grid>
  );
};

export default PageSelect;
