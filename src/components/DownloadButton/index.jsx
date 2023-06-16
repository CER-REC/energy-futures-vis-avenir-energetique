import { useIntl } from 'react-intl';
import React, { useCallback, useMemo } from 'react';
import Papa from 'papaparse';
import { Button, makeStyles } from '@material-ui/core';
import { saveAs } from 'file-saver';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';
import { convertUnit } from '../../utilities/convertUnit';
import { PAGES } from '../../constants';
import analytics from '../../analytics';
// TODO: Remove after refactoring into useEnergyFutureData to provide a uniform data structure
const selectionUnits = {
  energyDemand: 'petajoules',
  electricityGeneration: 'gigawattHours',
  oilProduction: 'thousandCubicMetres',
  gasProduction: 'millionCubicMetres',
};

const useStyles = makeStyles(theme => ({
  download: {
    ...theme.mixins.contextButton,
  },
}));

const DownloadButton = () => {
  const classes = useStyles();
  const intl = useIntl();
  const {
    regions: { order: regionOrder },
    sources: { electricity: { order: sourceOrder } },
  } = useAPI();
  const { config } = useConfig();
  const { rawData: data, prices } = useEnergyFutureData();

  const headers = useMemo(() => ({
    selection: intl.formatMessage({ id: 'common.selection' }).toLowerCase(),
    region: intl.formatMessage({ id: 'common.region' }).toLowerCase(),
    scenario: intl.formatMessage({ id: 'common.scenario' }).toLowerCase(),
    sector: intl.formatMessage({ id: 'common.sector' }).toLowerCase(),
    source: intl.formatMessage({ id: 'common.source' }).toLowerCase(),
    year: intl.formatMessage({ id: 'common.year' }).toLowerCase(),
    value: intl.formatMessage({ id: 'common.value' }).toLowerCase(),
    unit: intl.formatMessage({ id: 'common.unit' }).toLowerCase(),
    dataset: intl.formatMessage({ id: 'common.dataset' }).toLowerCase(),
  }), [intl]);

  const downloadCSV = useCallback(() => {
    const defaultUnit = selectionUnits[config.mainSelection];
    const conversionRatio = convertUnit(defaultUnit, config.unit);
    const selection = intl.formatMessage({ id: `common.selections.${config.mainSelection}` }).toUpperCase();
    const region = intl.formatMessage({ id: `common.regions.${config.provinces[0]}` }).toUpperCase();
    const sector = config.page === 'by-sector' && intl.formatMessage({ id: `common.sectors.${config.sector}` }).toUpperCase();
    const scenario = intl.formatMessage({ id: `common.scenarios.${config.scenarios[0]}` }).toUpperCase();
    const unit = intl.formatMessage({ id: `common.units.${config.unit}` });
    const dataset = intl.formatMessage({ id: `common.datasets.${config.yearId}`, defaultMessage: config.yearId }).toUpperCase();
    const sourceType = PAGES.find(
      page => page.id === config.page,
    ).sourceTypes?.[config.mainSelection];
    // The electricity visualization does not completely use the API to filter the data
    // TODO: Remove after implementing a uniform filter solution (all on server or all on client),
    // and when the electricity special cases in useEnergyFutureData are removed
    const filteredData = (data || []).filter((resource) => {
      if (config.page === 'electricity') {
        const regions = config.provinces[0] === 'ALL' ? regionOrder : config.provinces;
        const sources = config.sources[0] === 'ALL' ? sourceOrder : config.sources;

        return (
          sources.includes(resource.source)
          && regions.includes(resource.province)
          && resource.province !== 'ALL'
          && resource.source !== 'ALL'
        );
      }

      return true;
    });
    const csvData = filteredData.map((resource) => {
      if (config.mainSelection === 'greenhouseGasEmission') {
        return {
          [headers.region]: intl.formatMessage({ id: 'common.regions.ALL' }).toUpperCase(),
          [headers.sector]: intl.formatMessage({ id: `common.sources.${sourceType}.${resource.source}` }),
          [headers.scenario]: intl.formatMessage({ id: `common.scenarios.${resource.scenario}` }).toUpperCase(),
          [headers.year]: resource.year,
          [headers.value]: resource.value,
          [headers.unit]: intl.formatMessage({ id: 'components.downloadButton.units.greenhouseGasEmission' }),
          [headers.dataset]: dataset,
        };
      }

      switch (config.page) {
        case 'by-region':
          return {
            [headers.selection]: selection,
            [headers.region]: intl.formatMessage({ id: `common.regions.${resource.province}` }).toUpperCase(),
            [headers.scenario]: scenario,
            [headers.year]: resource.year,
            [headers.value]: resource.value * conversionRatio,
            [headers.unit]: unit,
            [headers.dataset]: dataset,
          };
        case 'by-sector':
          return {
            [headers.region]: region,
            [headers.sector]: sector,
            [headers.source]: intl.formatMessage({ id: `common.sources.${sourceType}.${resource.source}` }).toUpperCase(),
            [headers.scenario]: scenario,
            [headers.year]: resource.year,
            [headers.value]: resource.value * conversionRatio,
            [headers.unit]: unit,
            [headers.dataset]: dataset,
          };
        case 'electricity':
          return {
            [headers.region]: intl.formatMessage({ id: `common.regions.${resource.province}` }).toUpperCase(),
            [headers.source]: intl.formatMessage({ id: `common.sources.${sourceType}.${resource.source}` }).toUpperCase(),
            [headers.scenario]: scenario,
            [headers.year]: resource.year,
            [headers.value]: resource.value * conversionRatio,
            [headers.unit]: unit,
            [headers.dataset]: dataset,
          };
        case 'scenarios':
          return {
            [headers.selection]: selection,
            [headers.region]: region,
            [headers.scenario]: intl.formatMessage({ id: `common.scenarios.${resource.scenario}` }).toUpperCase(),
            [headers.year]: resource.year,
            [headers.value]: resource.value * conversionRatio,
            [headers.unit]: unit,
            [headers.dataset]: dataset,
          };
        case 'oil-and-gas':
          return {
            [headers.selection]: selection,
            [headers.region]: intl.formatMessage({ id: `common.regions.${resource.province}` }).toUpperCase(),
            [headers.source]: intl.formatMessage({ id: `common.sources.${sourceType}.${resource.source}` }).toUpperCase(),
            [headers.scenario]: scenario,
            [headers.year]: resource.year,
            [headers.value]: resource.value * conversionRatio,
            [headers.unit]: unit,
            [headers.dataset]: dataset,
          };
        default:
          throw new Error('Invalid data download.');
      }
    });

    if (config.page === 'scenarios') {
      for (let i = 0; i < prices?.length; i++) {
        const price = prices[i];

        csvData.push({
          [headers.selection]: intl.formatMessage({ id: `common.sources.price.${config.priceSource}` }),
          [headers.region]: intl.formatMessage({ id: 'common.regions.ALL' }).toUpperCase(),
          [headers.scenario]: intl.formatMessage({ id: `common.scenarios.${price.scenario}` }).toUpperCase(),
          [headers.year]: price.year,
          [headers.value]: price.value,
          [headers.unit]: intl.formatMessage({ id: `components.downloadButton.units.${config.mainSelection}` }),
          [headers.dataset]: dataset,
        });
      }
    }

    const blob = new Blob(['\uFEFF', Papa.unparse(csvData)], { type: 'text/csv;charset=utf-8;' });
    const name = `${intl.formatMessage({ id: 'components.downloadButton.filename' })}.csv`;

    saveAs(blob, name);
  }, [config, intl, regionOrder, sourceOrder, data, prices, headers]);

  const onClick = () => {
    analytics.reportMisc(config.page, 'click', 'download');
    downloadCSV();
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={onClick}
      className={classes.download}
      disabled={!data?.length}
    >
      {intl.formatMessage({ id: 'components.downloadButton.label' })}
    </Button>
  );
};

export default DownloadButton;
