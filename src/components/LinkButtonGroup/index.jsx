import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles, createStyles, Grid, Button, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@material-ui/core';

const useStyles = makeStyles(theme => createStyles({
  title: {
    color: theme.palette.primary.main,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  btn: props => ({
    height: 'auto',
    width: '100%',
    minWidth: 0,
    padding: '2px 8px !important',
    fontSize: 12,
    textTransform: 'capitalize',
    justifyContent: props.accent || 'right',
  }),
  btnIcon: {
    'button&': {
      height: 22,
      width: 24,
      padding: '0 4px !important',
      '&:hover': { boxShadow: 'none' },
    },
    '& svg': { fontSize: 16 },
  },
  accent: {
    width: 8,
    backgroundColor: theme.palette.primary.main,
    '& + div': { width: `calc(100% - ${theme.spacing(1)}px)` },
  },
}));

const LinkButtonGroup = ({ title, labels, accent, className }) => {
  const classes = useStyles({ accent });

  const [select, setSelect] = useState(undefined);

  /**
   * This is a button group in which buttons share the same accent color bar.
   */
  const generateLebelGroup = labelGroup => (
    <Grid container>
      {accent === 'left' && <Grid item className={classes.accent} />}
      <Grid item>
        <Grid
          container
          direction="column"
          alignItems={accent === 'left' ? 'flex-start' : 'flex-end'}
          spacing={labelGroup[0].icon ? 0 : 1}
        >
          {labelGroup.map(label => (
            <Grid item key={`link-button-${label.name || label}`} style={{ lineHeight: 0 }}>
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
        </Grid>
      </Grid>
      {accent !== 'left' && <Grid item className={classes.accent} />}
    </Grid>
  );

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems={accent === 'left' ? 'flex-start' : 'flex-end'}
        spacing={1}
        className={className}
      >
        {title && (
          <Grid item xs={12}>
            <Typography variant="body1" color="primary" className={classes.title}>{title}</Typography>
          </Grid>
        )}
        {labels.map(labelGroup => <Grid item key={`link-button-group-${Math.random()}`}>{generateLebelGroup(labelGroup)}</Grid>)}
      </Grid>

      {/* TODO: replace the mock-up pop-up with the real design */}
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
  labels: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape({
    icon: PropTypes.element,
    name: PropTypes.string,
  }), PropTypes.string]))), // array of arries of strings
  accent: PropTypes.string, // 'left', 'right'
  className: PropTypes.string, // root class names
};

LinkButtonGroup.defaultProps = {
  title: undefined,
  labels: [],
  accent: 'left',
  className: undefined,
};

export default LinkButtonGroup;
