import React, { useMemo } from 'react';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { TABS } from '../../constants';

const Nav = ({ page, onChange }) => {
  const tab = useMemo(() => TABS.findIndex(tab => tab.page === page), [page]);
  if (tab < 0) {
    return null;
  }

  return (
    <AppBar position="static" className="Nav">
      <Tabs value={tab} onChange={onChange}>
        {TABS.map((tab) => <Tab key={`nav-tab-${tab.page}`} label={tab.label} />)}
      </Tabs>
    </AppBar>
  );
};

export default Nav;
