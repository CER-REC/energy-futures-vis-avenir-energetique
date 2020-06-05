import React, { useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import data from './data';
import {
  Grid, AppBar, Tabs, Tab,
} from '@material-ui/core';

import Control from '../Control/index';
import Region from '../Region/index';

const Prototype = () => {
  const [tab, setTab] = useState(0);

  const handleTabChange = (_, tab) => setTab(tab);

  const tabs = (
    <AppBar position="static">
      <Tabs value={tab} onChange={handleTabChange}>
        <Tab label="Total Demand" />
        <Tab label="By Sector" />
        <Tab label="Electricity" />
        <Tab label="Senarios" />
        <Tab label="Demand" />
      </Tabs>
    </AppBar>
  );

  const content = (
    <Grid container wrap="nowrap" spacing={1} style={{ padding: 16 }}>
      <Grid item style={{ width: 180 }}>
        <Control />
      </Grid>
      <Grid item>
        <Region />
      </Grid>
      <Grid item style={{ flexGrow: 1, height: 560 }}>
        <ResponsiveBar
          data={data}
          keys={[ 'hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut' ]}
          indexBy="country"
          margin={{ top: 50, right: 0, bottom: 50, left: 80 }}
          padding={0.3}
          colors={{ scheme: 'nivo' }}
          defs={[
              {
                  id: 'dots',
                  type: 'patternDots',
                  background: 'inherit',
                  color: '#38bcb2',
                  size: 4,
                  padding: 1,
                  stagger: true
              },
              {
                  id: 'lines',
                  type: 'patternLines',
                  background: 'inherit',
                  color: '#eed312',
                  rotation: -45,
                  lineWidth: 6,
                  spacing: 10
              }
          ]}
          fill={[
              {
                  match: {
                      id: 'fries'
                  },
                  id: 'dots'
              },
              {
                  match: {
                      id: 'sandwich'
                  },
                  id: 'lines'
              }
          ]}
          borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              // legend: 'country',
              legendPosition: 'middle',
              legendOffset: 32
          }}
          axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              // legend: 'food',
              legendPosition: 'middle',
              legendOffset: -40
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </Grid>
    </Grid>
  );

  return (
    <>
      {tabs}
      {content}
    </>
  );
};

export default Prototype;
