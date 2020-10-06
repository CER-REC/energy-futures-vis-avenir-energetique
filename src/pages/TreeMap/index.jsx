import React from 'react';
// import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import mockData from './mockData';
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

const TreeMapCollection = ({ showSourceLabel, selectedYear }) => {
  const { regions } = useAPI();
  const { loading, error, data } = useQuery(query, {
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

  if (!data) {
    return null;
  }

  const base = data.resources.reduce((acc, val) => {
    if (!acc[val.year]) {
      acc[val.year] = [];
    }
    if (!acc[val.year].find(element => element.name === val.source)) {
      acc[val.year].push({ name: val.source, total: 0, children: [] });
    }

    return acc;
  }, {});

  const formattedData = data.resources.reduce((acc, val) => {
    const entry = acc[val.year].find(e => e.name === val.source);
    entry.children.push({
      name: val.province,
      color: regions.colors[val.province],
      value: val.value,
    });
    entry.total += val.value;
    // console.log(entry);
    return acc;
  }, base);

  console.log(formattedData);
  console.log(data);

  const trees = formattedData[selectedYear].sort((a, b) => b.total - a.total).map(source => (
    <div key={source.name} style={{ height: source.total * 1.5, width: source.total * 1.5, marginRight: '50px' }}>

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
    </div>
  ));

  return trees;
};

const TreeMap = () => (
  <Grid container>
    <Grid container wrap="nowrap">
      <TreeMapCollection showSourceLabel selectedYear={2016} />
    </Grid>
    <Grid container wrap="nowrap" style={{ marginTop: 15 }}>
      <hr style={{ width: '100%' }} />
    </Grid>
    <Grid container wrap="nowrap">
      <TreeMapCollection selectedYear={2020} />
    </Grid>
  </Grid>
);

export default TreeMap;
