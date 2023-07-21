import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useIntl } from 'react-intl';
import useConfig from '../../hooks/useConfig';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';
import analytics from '../../analytics';
import { CONFIG_LAYOUT } from '../../constants';
import DropDown from '../Dropdown';
import HintPrice from '../HintPrice';

const selectWidth = 200;

const useStyles = makeStyles(theme => ({
  select: {
    width: selectWidth,
    textAlign: 'center',
  },
  menu: {
    '& .MuiListItem-root': {
      display: 'block',
      textAlign: 'center',
      whiteSpace: 'break-spaces',
      width: selectWidth,
    },
  },
  labelContainer: {
    ...theme.mixins.labelContainer,
    ...theme.mixins.unitContainer,
  },
}));

const PriceSelect = () => {
  const classes = useStyles();
  const intl = useIntl();
  const { config, configDispatch } = useConfig();
  const { priceYear } = useEnergyFutureData();
  const { priceSources } = CONFIG_LAYOUT[config.mainSelection];
  const options = priceSources.map(source => [
    intl.formatMessage({ id: `components.priceSelect.${source}` }, { year: priceYear }),
    source,
  ]);
  const onChange = (value) => {
    configDispatch({ type: 'priceSource/changed', payload: value });
    analytics.reportFeature(config.page, 'benchmark price', value);
  };

  return (
    <div className={classes.labelContainer}>
      <Typography variant="subtitle1">
        {intl.formatMessage({ id: 'common.benchmarkPrices' })}
      </Typography>
      <HintPrice />
      <DropDown
        className={classes.select}
        menuClassName={classes.menu}
        options={options}
        value={config.priceSource}
        renderValue={value => intl.formatMessage({ id: `common.prices.${value}` })}
        onChange={onChange}
      />
    </div>
  );
};

export default PriceSelect;
