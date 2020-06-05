import React from 'react';
import {
  Grid, Typography, Button,
} from '@material-ui/core';

const Region = ({ width }) => {
  return (
    <Grid container direction="column" spacing={1} style={{ width: width || '100%' }}>
      <Grid item xs={12}>
        <Typography variant="body1">REGION</Typography>
      </Grid>
      {['All', 'YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'].map(region => (
        <Grid item key={`region-btn-${region}`}>
          <Button variant="contained" color="secondary" style={{ width: 46, minWidth: 0 }}>{region}</Button>
        </Grid>
      ))}

    </Grid>
  );
};

export default Region;
