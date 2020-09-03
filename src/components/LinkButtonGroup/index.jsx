import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles, createStyles, Grid, Button, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@material-ui/core';

const useStyles = makeStyles(theme => createStyles({
  root: {
    height: '100%',
  },
  title: {
    color: theme.palette.primary.main,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  btn: props => ({
    height: 'auto',
    minWidth: 0,
    padding: '2px 8px !important',
    textTransform: 'capitalize',
    borderLeft: props.accent === 'left' ? `3px solid ${theme.palette.primary.main}` : 'none',
    borderRight: props.accent === 'left' ? 'none' : `3px solid ${theme.palette.primary.main}`,
    '&:hover': {
      borderLeft: props.accent === 'left' ? `3px solid ${theme.palette.primary.main}` : 'none',
      borderRight: props.accent === 'left' ? 'none' : `3px solid ${theme.palette.primary.main}`,
    },
  }),
  btnIcon: {
    height: '24px !important',
    width: 40,
  },
}));

const LinkButtonGroup = ({ title, labels, accent }) => {
  const classes = useStyles({ accent });

  const [select, setSelect] = useState(undefined);

  return (
    <>
      <Grid
        container
        direction="column-reverse"
        alignItems={accent === 'left' ? 'flex-start' : 'flex-end'}
        spacing={1}
        className={classes.root}
      >
        {labels.map(label => (
          <Grid item key={`link-button-${label.name || label}`}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setSelect(label.name || label)}
              className={`${classes.btn} ${label.icon && classes.btnIcon}`}
            >
              {label.icon || label}
            </Button>
          </Grid>
        ))}

        {title && (
          <Grid item>
            <Typography variant="body1" coor="primary" className={classes.title}>{title}</Typography>
          </Grid>
        )}
      </Grid>

      <Dialog open={!!select} onClose={() => setSelect(undefined)}>
        <DialogTitle>{select}</DialogTitle>
        <DialogContent style={{ textAlign: 'justify' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit
          esse cillum dolore eu fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat non proident,
          sunt in culpa qui officia deserunt mollit anim id est laborum.
        </DialogContent>
        <DialogActions style={{ padding: 24 }}>
          <Button variant="contained" color="primary" onClick={() => setSelect(undefined)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

LinkButtonGroup.propTypes = {
  title: PropTypes.string,
  labels: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape({
    icon: PropTypes.element,
    name: PropTypes.string,
  }), PropTypes.string])),
  accent: PropTypes.string, // 'left', 'right'
};

LinkButtonGroup.defaultProps = {
  title: undefined,
  labels: [],
  accent: 'left',
};

export default LinkButtonGroup;
