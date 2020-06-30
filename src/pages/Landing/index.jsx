import React, { useContext } from 'react';
import { makeStyles, createStyles, Grid, ButtonBase, Typography } from '@material-ui/core';
import { TABS } from '../../constants';
import { ConfigContext } from '../../containers/App/lazy';

const Landing = () => {
  const classes = useStyles();

  const { config, setConfig } = useContext(ConfigContext);

  const handleRedirect = (page) => () => setConfig({ ...config, page  });
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">Landing Page</Typography>
      </Grid>
      {TABS.map(tab => (
        <Grid key={`landing-box-${tab.page}`} item xs={12} sm={6} md={4} lg={3} className={classes.box}>
          <ButtonBase onClick={handleRedirect(tab.page)} style={{ backgroundColor: tab.bg }}>
            <Typography variant="h4">{tab.label}</Typography>
          </ButtonBase>
        </Grid>
      ))}
    </Grid>
  );
};

const useStyles = makeStyles(theme => createStyles({
  box: {
    minHeight: 150,
    '& > button': {
      height: '100%',
      width: '100%',
      padding: theme.spacing(1),
      boxShadow: theme.shadows[0],
      transition: 'box-shadow .25s ease-in-out',
      '&:hover': { boxShadow: theme.shadows[6] },
    },
    '& h4': { color: theme.palette.getContrastText(theme.palette.primary.dark) },
  },
}));

export default Landing;
