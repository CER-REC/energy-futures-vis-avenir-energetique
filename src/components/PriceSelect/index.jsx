import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useIntl } from 'react-intl';
import useConfig from '../../hooks/useConfig';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';
import { CONFIG_LAYOUT } from '../../constants';
import DropDown from '../Dropdown';
import HintPrice from '../HintPrice';

const selectWidth = 200;

const useStyles = makeStyles({
  root: {
    alignItems: 'center',
    display: 'flex',
  },
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
});

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

  return (
    <div className={classes.root}>
      <Typography variant="body1" color="secondary" style={{ textTransform: 'uppercase' }}>
        {intl.formatMessage({ id: 'common.benchmarkPrices' })}
        &nbsp;
      </Typography>
      <DropDown
        className={classes.select}
        menuClassName={classes.menu}
        options={options}
        value={config.priceSource}
        renderValue={value => intl.formatMessage({ id: `common.prices.${value}` })}
        onChange={value => configDispatch({ type: 'priceSource/changed', payload: value })}
      />
      <HintPrice />
    </div>
  );
};

export default PriceSelect;
