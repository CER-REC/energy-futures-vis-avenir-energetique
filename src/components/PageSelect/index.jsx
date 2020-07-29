/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  makeStyles, createStyles,
  Grid, Typography, Button,
} from '@material-ui/core';

const useStyles = makeStyles(theme => createStyles({
  root: props => ({
    width: props.width || '100%',
    '& > div': { textAlign: 'center' },
    marginLeft: '20px',
    marginBottom: '10px',
    paddingTop: '12px',
    height: '70px',
  }),
  pageButtonCommon: {
    backgroundColor: 'dodgerblue',
    marginBottom: 30,
    marginRight: 10,
    height: '100%',
  },
  pageButtonUnselected: {
    width: '10%',
  },
  pageButtonSelected: {
    width: '40%',
  },
  pageButton: {
    width: '100%',
    height: '100%',
  },
}));

const PageSelect = (props) => {
  const classes = useStyles();
  const [selectedPage, setSelectedPage] = useState('By Region');

  const pages = props.pages || [
    'Home',
    'By Region',
    'By Sector',
    'Electricity',
    'Scenarios',
    'Demand',
  ];

  const pageButtons = pages.map((page) => {
    if (page === selectedPage) {
      return (
        <Grid
          key={page}
          item
          style={{ width: '40%' }}
          className={classes.pageButtonCommon}
        >
          <Button
            className={classes.pageButton}
            onClick={() => setSelectedPage(page)}
          ><Typography>{page}</Typography>
          </Button>
        </Grid>
      );
    }
    return (
      <Grid
        key={page}
        item
        style={{ width: '10%' }}
        className={classes.pageButtonCommon}
      >
        <Button
          className={classes.pageButton}
          onClick={() => setSelectedPage(page)}
        ><Typography>{page}</Typography>
        </Button>
      </Grid>
    );
  });

  return (
    <Grid container alignItems="center" wrap='nowrap' className={classes.root}>
      {pageButtons}
    </Grid>
  );
};

export default PageSelect;
