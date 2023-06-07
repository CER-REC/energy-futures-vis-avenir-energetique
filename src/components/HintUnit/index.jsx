import React from 'react';
import { useIntl } from 'react-intl';
import { Grid, Typography, Divider } from '@material-ui/core';
import { CONFIG_LAYOUT, SOURCE_ICONS, SOURCE_COLORS } from '../../constants';
import HintContent from '../HintContent';
import Hint from '../Hint';
import OilGasContent from '../OilGasContent';

const ElectricityIcon = () => (
  <SOURCE_ICONS.energy.ELECTRICITY style={{ backgroundColor: SOURCE_COLORS.energy.ELECTRICITY }} />
);

const UnitContent = () => {
  const intl = useIntl();
  const getContents = units => units.map(unit => ({
    title: `${intl.formatMessage({ id: `components.hintUnit.${unit}.title` })} (${intl.formatMessage({ id: `common.units.${unit}` })})`,
    description: intl.formatMessage({ id: `components.hintUnit.${unit}.description` }),
  }));
  const uniqueElectricityUnits = CONFIG_LAYOUT.electricityGeneration.unit.filter(
    unit => !CONFIG_LAYOUT.energyDemand.unit.includes(unit),
  );

  return (
    <Grid container alignItems="flex-start" spacing={2}>
      <Grid item xs={12}><Typography variant="h4">{intl.formatMessage({ id: 'common.energyUnits' })}</Typography></Grid>
      <HintContent contents={getContents(CONFIG_LAYOUT.energyDemand.unit)} />
      <HintContent
        IconComponent={ElectricityIcon}
        title={intl.formatMessage({ id: 'components.mainSelect.electricityGeneration.title' })}
        contents={getContents(uniqueElectricityUnits)}
      />
      <Grid item xs={12}><Divider /></Grid>
      <Grid item xs={12}><Typography variant="h4">{intl.formatMessage({ id: 'common.volumetricUnits' })}</Typography></Grid>
      <OilGasContent
        oil={getContents(CONFIG_LAYOUT.oilProduction.unit)}
        gas={getContents(CONFIG_LAYOUT.gasProduction.unit)}
      />
      <Grid item xs={12}><Divider /></Grid>
      <Grid item xs={12}><Typography variant="h4">{intl.formatMessage({ id: 'common.emissionsUnits' })}</Typography></Grid>
      <HintContent contents={getContents(CONFIG_LAYOUT.greenhouseGasEmission.unit)} />
    </Grid>
  );
};

const HintUnit = () => <Hint label="unit" content={[<UnitContent />]} maxWidth="md" />;

export default HintUnit;
