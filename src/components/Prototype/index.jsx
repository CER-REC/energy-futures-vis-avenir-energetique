import React, { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import rawData from './data';
import {
  Grid, AppBar, Tabs, Tab,
} from '@material-ui/core';

import Control from '../Control/index';
import Region from '../Region/index';


const PROVINCES = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];

const Prototype = () => {
  const [tab, setTab] = useState(0);
  const [data, setData] = useState(undefined); // year : object

  useEffect(() => {
    const processedData = {};
    (rawData || []).map(seg => {
      if (!seg.year || !seg.province || !seg.value) {
        return;
      }
      !processedData[seg.year] && (processedData[seg.year] = {});
      !processedData[seg.year][seg.province] && (processedData[seg.year][seg.province] = 0);
      processedData[seg.year][seg.province] += seg.value;
    });

    const readyData = Object.keys(processedData).map(year =>
      PROVINCES.reduce((accu, province) => ({ ...accu, [province]: processedData[year][province] }), { year }));

    setData(readyData);
  }, []);

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

  const content = data && (
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
          keys={PROVINCES}
          indexBy="year"
          margin={{ top: 50, right: 0, bottom: 50, left: 80 }}
          padding={0.1}
          colors={{ scheme: 'nivo' }}
          borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'middle',
            legendOffset: 32,
            format: year => (year % 5) ? '' : year,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          enableLabel={false}
          // labelSkipWidth={12}
          // labelSkipHeight={12}
          // labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
          animate={false}
          // motionStiffness={90}
          // motionDamping={15}
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
