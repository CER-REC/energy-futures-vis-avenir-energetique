import React, { useCallback, useState } from 'react';

import PropTypes from 'prop-types';
import { Grid, Typography, Button } from '@material-ui/core';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import useAPI from '../../hooks/useAPI';

const query = gql`
query ($iteration: ID!, $regions: [Region!], $scenarios: [String!], $sources: [GasSource!]) {
  resources:gasProductions(iterationIds: [$iteration], regions: $regions, scenarios: $scenarios, sources: $sources ){
      province: region
      year
      scenario
      value: quantity
      source
    }
  }
`;

const TreeMapCollection = ({ data, showSourceLabel, view, regions }) => {
  // bySource needs to be a bit bigger, because some sources are very small.
  const sizeMultiplier = view === 'bySource' ? 1.5 : 1;

  // Sort data by largest total
  const sortedData = data
    .sort((a, b) => b.total - a.total);

  // Filter out data to just see the selected regions.
  // This will be handled at the data fetching level when this component it integrated into the app.
  const regionData = sortedData
    .filter(entry => regions.find(region => entry.name === region));

  const treeMapData = view === 'bySource' ? sortedData : regionData;

  const trees = treeMapData.map((source) => {
    if (source.total === 0) {
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
          colors={d => d.color}
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

const OilAndGas = ({ view, selectedYear1, selectedYear2, regions1, regions2 }) => {
  const { regions } = useAPI();
  const { data } = useQuery(query, {
    variables: {
      scenarios: ['Evolving'],
      iteration: '6',
      regions: ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'],
      // FIXME: config will store it as "total"
      // it should be "total end-use"
      sectors: 'total end-use',
      sources: ['TIGHT', 'CBM', 'NA', 'SHALE', 'SOLUTION'],
    },
  });

  // Compare button toggle
  const [compare, setCompare] = useState(false);

  const getData = useCallback(
    (inputData, dataView) => {
      /*
      The data structure between the two view is very similar.
      To take advantage of this, the structure can be easily re arranged
      by determining the view, and swapping the variables in the logic below.
      */
      const viewVariables = {
        byRegion: { outer: 'province', inner: 'source' },
        bySource: { outer: 'source', inner: 'province' },
      };

      const gasColors = {
        ALL: 'black',
        CBM: 'red',
        OIL: 'pink',
        TIGHT: 'pink',
        NA: 'orange',
        SHALE: 'yellow',
        SOLUTION: 'green',
      };
      const baseStructure = inputData.resources.reduce((acc, val) => {
        if (!acc[val.year]) {
          acc[val.year] = [];
        }
        if (!acc[val.year].find(element => element.name === val[viewVariables[dataView].outer])) {
          acc[val.year].push({ name: val[viewVariables[dataView].outer], total: 0, children: [] });
        }
        return acc;
      }, {});

      // I am not super happy with the way this logic mutates the baseStructure
      inputData.resources.reduce((acc, val) => {
        const entry = acc[val.year].find(e => e.name === val[viewVariables[dataView].outer]);
        entry.children.push({
          name: val[viewVariables[dataView].inner],
          color: view === 'bySource' ? regions.colors[val[viewVariables[dataView].inner]] : gasColors[val.source],
          value: val.value,
        });
        entry.total += val.value;
        return acc;
      }, baseStructure);
      return baseStructure;
    },
    [regions.colors, view],
  );

  if (!data) {
    return null;
  }

  return (
    <Grid container>

      <Grid style={{ marginLeft: '80%', align: 'right' }}>
        <Typography variant='h3'>2020</Typography>
        <Button
          onClick={() => setCompare(!compare)}
          variant="outlined"
        >
          <Typography
            variant='body1'
          >{compare ? 'Dont Compare' : 'compare'}
          </Typography>
        </Button>
      </Grid>

      <Grid container wrap="nowrap">
        <TreeMapCollection
          data={getData(data, view)[selectedYear1]}
          showSourceLabel
          selectedYear={selectedYear1}
          view={view}
          regions={regions1}
        />
      </Grid>

      <Grid container wrap="nowrap" style={{ marginTop: 15 }}>
        <hr style={{ width: '100%' }} />
      </Grid>

      {compare
      && (
      <Grid container wrap="nowrap">
        <TreeMapCollection
          data={getData(data, view)[selectedYear2]}
          selectedYear={selectedYear2}
          showSourceLabel={view === 'byRegion'}
          view={view}
          regions={regions2}
        />
      </Grid>
      )}

    </Grid>
  );
};

OilAndGas.propTypes = {
  view: PropTypes.string.isRequired,
  selectedYear1: PropTypes.number.isRequired,
  selectedYear2: PropTypes.number.isRequired,
  regions1: PropTypes.arrayOf(PropTypes.string).isRequired,
  regions2: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default OilAndGas;
