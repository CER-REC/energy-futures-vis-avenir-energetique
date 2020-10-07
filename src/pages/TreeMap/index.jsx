import React, { useMemo, useCallback, useState } from 'react';

// import PropTypes from 'prop-types';
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

const TreeMapCollection = ({ data, showSourceLabel }) => {
  const sortedData = data.sort((a, b) => b.total - a.total);
  const trees = sortedData.map(source => (
    <Grid key={source.name} style={{ bottom: '0', height: source.total * 1.5, width: source.total * 1.5, marginRight: '50px' }}>

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
  ));
  return trees;
};

const TreeMap = ({ view, selectedYear1, selectedYear2, region1, region2 }) => {
  console.log(view);
  const { regions } = useAPI();
  const { _loading, _error, data } = useQuery(query, {
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

  const [compare, setCompare] = useState(false);

  const getData = useCallback(
    (inputData) => {
      const baseStructure = inputData.resources.reduce((acc, val) => {
        if (!acc[val.year]) {
          acc[val.year] = [];
        }
        if (!acc[val.year].find(element => element.name === val.source)) {
          acc[val.year].push({ name: val.source, total: 0, children: [] });
        }
        return acc;
      }, {});

      const formattedData = inputData.resources.reduce((acc, val) => {
        const entry = acc[val.year].find(e => e.name === val.source);
        entry.children.push({
          name: val.province,
          color: regions.colors[val.province],
          value: val.value,
        });
        entry.total += val.value;
        return acc;
      }, baseStructure);
      return formattedData;
    },
    [regions.colors],
  );

  const dataByRegion = useCallback((inputData) => {
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
        acc[val.year] = {};
      }
      if (!acc[val.year][val.province]) {
        acc[val.year][val.province] = { name: val.province, total: 0, children: [] };
      }
      return acc;
    }, {});

    // This mutates the array
    inputData.resources.reduce((acc, val) => {
      const entry = acc[val.year][val.province];
      entry.children.push({
        name: val.source,
        color: gasColors[val.source], // FIXME:
        value: val.value,
      });
      entry.total += val.value;
      return acc;
    }, baseStructure);
    return baseStructure;
  }, []);

  if (!data) {
    return null;
  }
  console.log(data);

  return (
    <Grid container>

      <Grid style={{ marginLeft: '80%', align: 'right' }}>
        <Typography variant='h3'>2016</Typography>
        <Button onClick={() => setCompare(!compare)} variant="outlined"><Typography variant='body1'>{compare ? 'Dont Compare' : 'compare'}</Typography></Button>
      </Grid>

      <Grid container wrap="nowrap">
        <TreeMapCollection
          data={view === 'byRegion' ? [dataByRegion(data)[selectedYear1][region1]] : getData(data)[selectedYear1]}
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
          data={view === 'byRegion' ? [dataByRegion(data)[selectedYear2][region2]] : getData(data)[selectedYear2]}
          selectedYear={selectedYear2}
          showSourceLabel={view === 'byRegion'}
        />
      </Grid>
      )}
    </Grid>
  );
};

export default TreeMap;
