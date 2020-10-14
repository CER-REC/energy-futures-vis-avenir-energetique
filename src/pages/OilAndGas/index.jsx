import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Grid, Typography, Button } from '@material-ui/core';
import { ResponsiveTreeMap } from '@nivo/treemap';
import useConfig from '../../hooks/useConfig';
import useAPI from '../../hooks/useAPI';

const TreeMapCollection = ({ data, showSourceLabel }) => {
  const { regions: { colors: regionColors } } = useAPI();
  const { config } = useConfig();

  // the oil and gas colors are not yet availible
  const tempGasColors = {
    ALL: 'black',
    CBM: 'red',
    OIL: 'blue',
    TIGHT: 'pink',
    NA: 'orange',
    SHALE: 'yellow',
    SOLUTION: 'green',
  };

  // bySource needs to be a bit bigger, because some sources are very small.
  const sizeMultiplier = config.view === 'source' ? 1.5 : 1;

  // Sort data by largest total
  const sortedData = data.length > 1 ? data
    .sort((a, b) => b.total - a.total) : data;

  const trees = sortedData.map((source) => {
    // Anything smaller than 20 will not even appear
    if (source.total < 20) {
      return null;
    }

    return (
      <Grid
        key={source.name}
        style={{
          bottom: '0',
          height: source.total * sizeMultiplier,
          width: source.total * sizeMultiplier,
          marginRight: '100px',
        }}
      >

        {showSourceLabel && <Typography style={{ marginLeft: 10 }}>{source.name}</Typography>}
        <ResponsiveTreeMap
          root={source}
          identity="name"
          value="value"
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          label={d => d.name}
          labelSkipSize={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.2]] }}
          colors={d => (config.view === 'source'
            ? regionColors[d.name]
            : tempGasColors[d.name])}
          borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
          animate
          motionStiffness={90}
          motionDamping={11}
        />

      </Grid>
    );
  });
  return trees;
};

const OilAndGas = ({ data }) => {
  const { config } = useConfig();
  // These will be replaced when the year slider is put in
  const selectedYear1 = 2005;
  const selectedYear2 = 2006;

  // Compare button toggle
  const [compare, setCompare] = useState(false);

  if (!data) {
    return null;
  }

  return (
    <Grid container>

      <Grid style={{ marginLeft: '80%', align: 'right' }}>
        <Typography variant='h3'>{selectedYear1}</Typography>
        {compare
        && <Typography variant='h3'>{selectedYear2}</Typography>}
        <Button
          onClick={() => setCompare(!compare)}
          variant="outlined"
          style={{ marginTop: '10px' }}
        >
          <Typography
            variant='body1'
          >{compare ? 'Dont Compare' : 'compare'}
          </Typography>
        </Button>
      </Grid>

      <Grid container wrap="nowrap">
        <TreeMapCollection
          data={data[selectedYear1]}
          showSourceLabel
          selectedYear={selectedYear1}
        />
      </Grid>

      <Grid container wrap="nowrap" style={{ marginTop: 15 }}>
        <hr style={{ width: '100%' }} />
      </Grid>

      {compare
      && (
      <Grid container wrap="nowrap">
        <TreeMapCollection
          data={data[selectedYear2]}
          selectedYear={selectedYear2}
          showSourceLabel={config.view === 'region'}
        />
      </Grid>
      )}

    </Grid>
  );
};

OilAndGas.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  year: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number }),
};

OilAndGas.defaultProps = {
  data: undefined,
  year: { min: 0, max: 0 },
};
export default OilAndGas;
