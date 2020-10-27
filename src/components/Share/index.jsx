import React, { useMemo } from 'react';
import LinkIcon from '@material-ui/icons/Link';
import EmailIcon from '@material-ui/icons/Email';
import Clipboard from 'clipboard';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { useIntl } from 'react-intl';

import { IconTwitter, IconFacebook, IconLinkedIn } from '../../icons';
import useConfig from '../../hooks/useConfig';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';
import { convertUnit } from '../../utilities/convertUnit';
import LinkButtonGroup from '../LinkButtonGroup';

// TODO: Remove after refactoring source type references into selection references
const selectionSourceTypes = {
  energyDemand: 'energy',
  electricityGeneration: 'electricity',
  oilProduction: 'oil',
  gasProduction: 'gas',
};

// TODO: Remove after refactoring into useEnergyFutureData to provide a uniform data structure
const selectionUnits = {
  energyDemand: 'petajoules',
  electricityGeneration: 'gigawattHours',
  oilProduction: 'thousandCubicMetres',
  gasProduction: 'millionCubicMetres',
};

const getBitlyURL = () => {
  const bitlyServiceURL = `${document.location.origin}/bitlyService/api/bitlyShortlink`;

  return fetch(`${bitlyServiceURL}?shortenUrl=${document.location.href}`)
    .then(response => response.json())
    .then((data) => {
      if (!data?.data?.url) {
        throw new Error('Error retrieving Bitly shortened URL.');
      }

      return data.data.url;
    }).catch(() => document.location.href);
};

const openShareWindow = baseUrl => getBitlyURL().then(bitlyUrl => window.open(
  `${baseUrl}${bitlyUrl}`,
  'targetWindow',
  'width=650,height=650',
));

const copy = {
  name: 'copy',
  icon: <LinkIcon />,
  content: () => getBitlyURL().then((bitlyUrl) => {
    // TODO: Remove and change to use useRef and useEffect when the browser clipboard API
    // allows for asynchronous copies (https://github.com/zenorocha/clipboard.js/issues/639)
    const ref = document.createElement('div');
    const clipboard = new Clipboard(ref, { text: () => bitlyUrl });

    ref.click();
    clipboard.destroy();
  }),
};

const linkedin = {
  name: 'linkedin',
  icon: <IconLinkedIn />,
  content: () => openShareWindow('https://www.linkedin.com/sharing/share-offsite/?&url='),
};

const facebook = {
  name: 'facebook',
  icon: <IconFacebook />,
  content: () => openShareWindow('https://www.facebook.com/sharer/sharer.php?u='),
};

const twitter = {
  name: 'twitter',
  icon: <IconTwitter />,
  content: () => openShareWindow('https://twitter.com/intent/tweet?url='),
};

const Share = () => {
  const intl = useIntl();
  const { config } = useConfig();
  const { rawData: data } = useEnergyFutureData();
  const download = useMemo(() => ({
    name: intl.formatMessage({ id: 'components.share.download' }),
    content: () => {
      const defaultUnit = selectionUnits[config.mainSelection];
      const conversionRatio = convertUnit(defaultUnit, config.unit);
      const selection = intl.formatMessage({ id: `common.selections.${config.mainSelection}` }).toUpperCase();
      const region = intl.formatMessage({ id: `common.regions.${config.provinces[0]}` }).toUpperCase();
      const sector = intl.formatMessage({ id: `common.sectors.${config.sector}` }).toUpperCase();
      const scenario = intl.formatMessage({ id: `common.scenarios.${config.scenarios[0]}` }).toUpperCase();
      const unit = intl.formatMessage({ id: `common.units.${config.unit}` });
      const dataset = intl.formatMessage({ id: `common.dataset.${config.yearId}`, defaultMessage: config.yearId }).toUpperCase();
      const headers = {
        selection: intl.formatMessage({ id: 'common.selection' }).toLowerCase(),
        region: intl.formatMessage({ id: 'common.region' }).toLowerCase(),
        scenario: intl.formatMessage({ id: 'common.scenario' }).toLowerCase(),
        sector: intl.formatMessage({ id: 'common.sector' }).toLowerCase(),
        source: intl.formatMessage({ id: 'common.source' }).toLowerCase(),
        year: intl.formatMessage({ id: 'common.year' }).toLowerCase(),
        value: intl.formatMessage({ id: 'common.value' }).toLowerCase(),
        unit: intl.formatMessage({ id: 'common.unit' }).toLowerCase(),
        dataset: intl.formatMessage({ id: 'common.dataset' }).toLowerCase(),
      };
      const sourceType = selectionSourceTypes[config.mainSelection];
      const csvData = data.map((resource) => {
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
              [headers.value]: resource.value * conversionRatio,
              [headers.unit]: unit,
              [headers.dataset]: dataset,
            };
          case 'scenarios':
            return {
              [headers.selection]: selection,
              [headers.region]: region,
              [headers.scenario]: scenario,
              [headers.year]: resource.year,
              [headers.value]: resource.value * conversionRatio,
              [headers.unit]: unit,
              [headers.dataset]: dataset,
            };
          case 'oil-and-gas':
            return {
              [headers.region]: intl.formatMessage({ id: `common.regions.${resource.province}` }).toUpperCase(),
              [headers.source]: intl.formatMessage({ id: `common.sources.${sourceType}.${resource.source}` }).toUpperCase(),
              [headers.value]: resource.value * conversionRatio,
              [headers.unit]: unit,
              [headers.dataset]: dataset,
            };
          default:
            throw new Error('Invalid data download.');
        }
      });

      saveAs(new Blob([Papa.unparse(csvData)], { type: 'text/csv' }), 'energyFutures.csv');
    },
  }), [intl, data, config]);
  const email = useMemo(() => ({
    name: 'email',
    icon: <EmailIcon />,
    content: () => {
      getBitlyURL().then((bitlyUrl) => {
        const subject = intl.formatMessage({ id: 'components.share.emailSubject' });
        const message = intl.formatMessage({ id: 'components.share.emailMessage' });
        const body = `${encodeURIComponent(bitlyUrl)}%0A%0A${encodeURIComponent(message)}`;
        const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;

        window.location.href = emailUrl;
      });
    },
  }), [intl]);

  return (
    <LinkButtonGroup
      labels={[[download], [
        copy,
        linkedin,
        facebook,
        twitter,
        email,
      ]]}
      accent="right"
    />
  );
};

export default Share;
