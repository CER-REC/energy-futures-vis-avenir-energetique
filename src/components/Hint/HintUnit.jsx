import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { makeStyles, Grid, Typography, Divider } from '@material-ui/core';
import { SOURCE_ICONS, SOURCE_COLORS } from '../../constants';

const useStyles = makeStyles(theme => ({
  subtitle: {
    marginBottom: theme.spacing(-2),
    '& svg': {
      height: theme.spacing(3.5),
      width: theme.spacing(3.5),
      padding: theme.spacing(0.5),
      color: theme.palette.common.white,
      borderRadius: '50%',
      verticalAlign: 'middle',
    },
    '& h6': { color: theme.palette.secondary.light },
    '& + div.MuiGrid-item': { paddingLeft: theme.spacing(5.5) },
  },
}));

const HintUnit = () => {
  const classes = useStyles();
  const intl = useIntl();

  const generateDescription = useCallback(unit => (
    <Grid item xs={6} key={`hint-content-entry-${unit}`}>
      <Typography variant="h6">
        {intl.formatMessage({ id: `components.unitSelect.${unit}.title` })} ({intl.formatMessage({ id: `common.units.${unit}` })})
      </Typography>
      <Typography variant="body2" color="secondary" component="span">
        {intl.formatMessage({ id: `components.unitSelect.${unit}.description` })}
      </Typography>
    </Grid>
  ), [intl]);

  const generateSubtitle = useCallback((title, label) => {
    const Icon = SOURCE_ICONS.energy[label];
    return Icon && (
      <Grid item xs={12} className={classes.subtitle}>
        <Grid container alignItems="center" wrap="nowrap" spacing={1}>
          <Grid item><Icon style={{ backgroundColor: SOURCE_COLORS.energy[label] }} /></Grid>
          <Grid item>
            <Typography variant="h6">{intl.formatMessage({ id: `components.mainSelect.${title}.title` })}</Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }, [intl, classes]);

  return (
    <Grid container alignItems="flex-start" spacing={2}>
      <Grid item xs={12}><Typography variant="h4">{intl.formatMessage({ id: 'common.energyUnits' })}</Typography></Grid>
      {['petajoules', 'kilobarrelEquivalents'].map(generateDescription)}
      {generateSubtitle('electricityGeneration', 'ELECTRICITY')}
      {generateDescription('gigawattHours')}

      <Grid item xs={12}><Divider /></Grid>

      <Grid item xs={12}><Typography variant="h4">{intl.formatMessage({ id: 'common.volumetricUnits' })}</Typography></Grid>
      {generateSubtitle('oilProduction', 'OIL')}
      {['kilobarrels', 'thousandCubicMetres'].map(generateDescription)}
      {generateSubtitle('gasProduction', 'GAS')}
      {['cubicFeet', 'millionCubicMetres'].map(generateDescription)}
    </Grid>
  );
};

export default HintUnit;
