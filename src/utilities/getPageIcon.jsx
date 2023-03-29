import React from 'react';
import { IconPageElectricity, IconPageOilAndGas, IconPageRegion, IconPageScenarios, IconPageSector } from '../icons';

export default (id) => {
  switch (id) {
    case 'by-region': return <IconPageRegion />;
    case 'by-sector': return <IconPageSector />;
    case 'electricity': return <IconPageElectricity />;
    case 'scenarios': return <IconPageScenarios />;
    case 'oil-and-gas': return <IconPageOilAndGas />;
    default: return null;
  }
};
