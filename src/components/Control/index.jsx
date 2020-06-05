import React from 'react';
import {
  Grid, Typography, Fab, Button,
} from '@material-ui/core';

import TotalIcon from '@material-ui/icons/DataUsage';
import ElectricityIcon from '@material-ui/icons/FlashOn';
import OilIcon from '@material-ui/icons/Opacity';
import GasIcon from '@material-ui/icons/LocalGasStation';


const Control = ({ width }) => {
  return (
    <Grid container spacing={1} style={{ width: width || '100%' }}>
      <Grid item xs={6} style={{ textAlign: 'center' }}>
        <Fab color="primary"><TotalIcon fontSize="large" /></Fab>
        <Typography variant="caption" component="div" style={{ marginTop: 6 }}>Total Demand</Typography>
      </Grid>
      <Grid item xs={6} style={{ textAlign: 'center' }}>
        <Fab color="primary"><ElectricityIcon fontSize="large" /></Fab>
        <Typography variant="caption" component="div" style={{ marginTop: 6 }}>Electricity</Typography>
      </Grid>
      <Grid item xs={6} style={{ textAlign: 'center' }}>
        <Fab color="primary"><OilIcon fontSize="large" /></Fab>
        <Typography variant="caption" component="div" style={{ marginTop: 6 }}>Oil Production</Typography>
      </Grid>
      <Grid item xs={6} style={{ textAlign: 'center' }}>
        <Fab color="primary"><GasIcon fontSize="large" /></Fab>
        <Typography variant="caption" component="div" style={{ marginTop: 6 }}>Gas Production</Typography>
      </Grid>

      <Grid item xs={12} style={{ marginTop: 16 }}>
        <Typography variant="body1">SELECT UNIT</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" fullWidth>PETAJOULE</Button>
      </Grid>
      <Grid item xs={12}>
        <Button variant="outlined" color="primary" fullWidth>kBOE/d</Button>
      </Grid>
      <Grid item xs={12}>
        <Button variant="outlined" color="primary" fullWidth>GW.h</Button>
      </Grid>

      <Grid item xs={12} style={{ marginTop: 16 }}>
        <Typography variant="body1">ENERGY FUTURES</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" fullWidth>2019</Button>
      </Grid>
      <Grid item xs={12}>
        <Button variant="outlined" color="primary" fullWidth>2018</Button>
      </Grid>
      <Grid item xs={12}>
        <Button variant="outlined" color="primary" fullWidth>2017</Button>
      </Grid>
      <Grid item xs={12}>
        <Button variant="outlined" color="primary" fullWidth>2016</Button>
      </Grid>

      <Grid item xs={12} style={{ marginTop: 16 }}>
        <Typography variant="body1">SELECT SCENARIO</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" fullWidth>REFERENCE</Button>
      </Grid>

    </Grid>
  );
};

export default Control;
