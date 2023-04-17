import React from 'react';
import PropTypes from 'prop-types';
import {
  IconPageElectricity, IconPageEmissions,
  IconPageOilAndGas,
  IconPageRegion,
  IconPageScenarios,
  IconPageSector,
} from '../../icons';

const PageIcon = ({ id }) => {
  switch (id) {
    case 'emissions': return <IconPageEmissions />;
    case 'by-region': return <IconPageRegion />;
    case 'by-sector': return <IconPageSector />;
    case 'electricity': return <IconPageElectricity />;
    case 'scenarios': return <IconPageScenarios />;
    case 'oil-and-gas': return <IconPageOilAndGas />;
    default: return null;
  }
};

PageIcon.propTypes = { id: PropTypes.string.isRequired };

export default PageIcon;
