import React from 'react';
import { useIntl } from 'react-intl';
import { Grid, Typography } from '@material-ui/core';
import { CONFIG_LAYOUT } from '../../constants';
import Hint from '../Hint';
import OilGasContent from '../OilGasContent';

const PriceContent = () => {
  const intl = useIntl();
  const getContents = sources => sources.map(source => ({
    title: intl.formatMessage({ id: `common.sources.price.${source}` }),
    description: intl.formatMessage({ id: `components.hintPrice.${source}` }),
  }));

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" style={{ textTransform: 'uppercase' }}>{intl.formatMessage({ id: 'common.prices' })}</Typography>
        <Typography variant="body2" color="secondary">
          {intl.formatMessage({ id: 'components.hintPrice.description' })}
        </Typography>
      </Grid>
      <OilGasContent
        oil={getContents(CONFIG_LAYOUT.oilProduction.priceSources)}
        gas={getContents(CONFIG_LAYOUT.gasProduction.priceSources)}
      />
    </Grid>
  );
};

const HintPrice = () => <Hint label="price" content={[<PriceContent />]} maxWidth="md" />;

export default HintPrice;
