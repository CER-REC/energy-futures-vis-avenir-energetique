/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import {
  makeStyles, createStyles,
  Grid, Typography, ButtonBase, Hidden,
} from '@material-ui/core';
import { PAGES } from '../../constants';
import { ConfigContext } from '../../containers/App/lazy';

const useStyles = makeStyles(theme => createStyles({
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

const PageSelect = () => {
  const classes = useStyles();

  const { config, setConfig } = useContext(ConfigContext);

  const pageButtons = PAGES.map((page) => (
    <Grid
      key={`page-${page.id}`}
      item
      className={classes.button}
      style={{ flexGrow: page.id === config.page ? 1 : 0 }}
    >
      <ButtonBase
        centerRipple
        onClick={() => setConfig({ ...config, page: page.id })}
      >
        <Hidden mdUp><Typography variant="body2">{page.label}</Typography></Hidden>
        <Hidden smDown><Typography variant="h6">{page.label}</Typography></Hidden>
      </ButtonBase>
    </Grid>
  ));

  return (
    <Grid container alignItems="center" wrap='nowrap' spacing={1}>
      {pageButtons}
    </Grid>
  );
};

export default PageSelect;
