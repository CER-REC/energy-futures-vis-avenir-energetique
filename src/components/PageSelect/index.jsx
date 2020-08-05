/* eslint-disable react/prop-types */
import React, { useContext, useState, useEffect } from 'react';
import {
  makeStyles, createStyles,
  Grid, ButtonBase, Typography,
} from '@material-ui/core';
import { PAGES } from '../../constants';
import { ConfigContext } from '../../containers/App/lazy';

import {
  PageIconBar, PageIconBubble, PageIconFlower, PageIconLine, PageIconStackedArea,
} from './PageIcons';

const getPageIcon = (id) => {
  switch(id) {
    case 'by-region': return <PageIconBar />;
    case 'by-sector': return <PageIconStackedArea />;
    case 'electricity': return <PageIconBubble />;
    case 'scenarios': return <PageIconLine />;
    case 'demand': return <PageIconFlower />;
    default: return null;
  }
};

const toFront = (pages, id) => pages.sort((a, b) => a.id === id ? -1 : b.id === id ? 1 : 0);

const PageSelect = () => {
  const classes = useStyles();

  const { config, setConfig } = useContext(ConfigContext);

  const [pages, setPages] = useState(PAGES.filter(page => page.id !== 'landing'));

  /**
   * Auto-sync the selected page.
   */
  useEffect(() => {
    config.page && config.page !== pages[0] && toFront(pages, config.page) },
    [config.page],
  );

  const handleSelect = (id) => {
    if (id === config.page) {
      return;
    }
    setPages(toFront([...pages], id));
    setConfig({ ...config, page: id });
  };

  const pageButtons = PAGES.filter(page => page.id !== 'landing').map(page => {
    const index = pages.findIndex(p => p.id === page.id) || 0;
    return (
      <ButtonBase
        key={`page-${page.id}`}
        centerRipple
        onClick={() => handleSelect(page.id)}
        classes={{ root: classes.box }}
        style={{
          top: index * 64 + 10,
          padding: index === 0 ? '0 8px' : 0,
        }}
      >
        <div className={classes.label} style={{
          height: index === 0 ? 60 : 0,
          width: index === 0 ? 300 : 0,
        }}>
          <Typography variant="h5" color="primary" style={{ opacity: index === 0 ? 1 : 0 }}>
            {page.label}
          </Typography>
          <Typography variant="h5" color="primary" style={{ opacity: index === 0 ? 1 : 0 }}>
            By {config.view}
          </Typography>
        </div>
        <div className={classes.icon}>{getPageIcon(page.id)}</div>
      </ButtonBase>
    );
  });

  return (
    <Grid container alignItems="center" wrap="nowrap" className={classes.root}>
      {pageButtons}
    </Grid>
  );
};

const useStyles = makeStyles(theme => createStyles({
  root: { position: 'relative' },
  box: {
    position: 'absolute',
    left: 0,
    height: 60,
    backgroundColor: '#F3EFEF',
    boxShadow: theme.shadows[4],
    zIndex: 1001,
    transition: 'top .5s ease-in-out, padding .5s ease-in-out',
  },
  icon: {
    height: 60,
    width: 60,
    '& > svg': { height: 60 },
  },
  label: {
    textAlign: 'left',
    transition: 'height .5s ease-in-out, width .5s ease-in-out',
    '& > h5': {
      margin: theme.spacing(0, .5),
      transition: 'opacity .5s ease-in-out',
    },
    '& > h5:first-of-type': {
      fontWeight: 700,
    },
  },


  button: {
    transition: 'flex-grow .25s ease-in-out',
    '& > button': {
      width: '100%',
      minHeight: 50,
      padding: theme.spacing(2),
      color: theme.palette.common.white,
      backgroundColor: '#344C81',
      '& h6, & p': { textTransform: 'uppercase' },
    },
  },
}));

export default PageSelect;
