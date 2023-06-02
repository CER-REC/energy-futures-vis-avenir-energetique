import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { SOURCE_ICONS, SOURCE_COLORS } from '../../constants';
import HintContent from '../HintContent';

const OilIcon = () => (
  <SOURCE_ICONS.energy.OIL style={{ backgroundColor: SOURCE_COLORS.energy.OIL }} />
);
const GasIcon = () => (
  <SOURCE_ICONS.energy.GAS style={{ backgroundColor: SOURCE_COLORS.energy.GAS }} />
);

const OilGasContent = ({ oil, gas }) => {
  const intl = useIntl();

  return (
    <>
      <HintContent
        IconComponent={OilIcon}
        title={intl.formatMessage({ id: 'components.mainSelect.oilProduction.title' })}
        contents={oil}
      />
      <HintContent
        IconComponent={GasIcon}
        title={intl.formatMessage({ id: 'components.mainSelect.gasProduction.title' })}
        contents={gas}
      />
    </>
  );
};

OilGasContent.propTypes = {
  oil: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  })).isRequired,
  gas: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  })).isRequired,
};

export default OilGasContent;
