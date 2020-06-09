import React from 'react';
import { AppBar, Tabs, Tab } from '@material-ui/core';

const TABS = ['Total Demand', 'By Sector', 'Electricity', 'Senarios', 'Demand'];

const Nav = ({ tab, onChange }) => (
  <AppBar position="static">
    <Tabs value={tab} onChange={onChange}>
      {TABS.map((label, i) => <Tab key={`nav-tab-${i}`} label={label} />)}
    </Tabs>
  </AppBar>
);

export default Nav;
