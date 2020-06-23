import React, { useContext } from 'react';
import {
  Grid, Typography, Button,
} from '@material-ui/core';

import { ConfigContext } from '../../containers/App/lazy';
import { REGIONS } from '../../types';


const Region = ({ width }) => {
  const { config, setConfig } = useContext(ConfigContext);

  const handleToggleRegion = region => () => {
    if (config.regions.indexOf(region) > -1) {
      setConfig({ ...config, regions: config.regions.filter(r => r !== region) });
    } else {
      setConfig({ ...config, regions: [...config.regions, region] });
    }
  };
  
  return (
    <Grid container direction="column" spacing={1} style={{ width: width || '100%' }}>
      <Grid item xs={12}>
        <Typography variant="body1">REGION</Typography>
      </Grid>
      {REGIONS.map(region => (
        <Grid item key={`region-btn-${region}`}>
          <Button
            variant={config.regions.indexOf(region) > -1 ? 'contained' : 'outlined'} color="secondary"
            onClick={handleToggleRegion(region)}
            style={{ width: 46, minWidth: 0 }}
          >
            {region}
          </Button>
        </Grid>
      ))}

    </Grid>
  );
};

export default Region;
