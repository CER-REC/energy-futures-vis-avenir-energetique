import React, { useCallback, useMemo, useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import LinkIcon from '@material-ui/icons/Link';
import EmailIcon from '@material-ui/icons/Email';
import Clipboard from 'clipboard';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { useIntl } from 'react-intl';

import { IconTwitter, IconFacebook, IconLinkedIn } from '../../icons';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';
import { convertUnit } from '../../utilities/convertUnit';
import { PAGES } from '../../constants';
import LinkButtonGroup from '../LinkButtonGroup';

// TODO: Remove after refactoring into useEnergyFutureData to provide a uniform data structure
const selectionUnits = {
  energyDemand: 'petajoules',
  electricityGeneration: 'gigawattHours',
  oilProduction: 'thousandCubicMetres',
  gasProduction: 'millionCubicMetres',
};

const getBitlyURL = () => {
  const bitlyServiceURL = `${document.location.origin}/bitlyService/api/bitlyShortlink`;

  return fetch(`${bitlyServiceURL}?shortenUrl=${encodeURIComponent(document.location.href)}`)
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
  const {
    regions: { order: regionOrder },
    sources: { electricity: { order: sourceOrder } },
  } = useAPI();
  const { config } = useConfig();
  const { rawData: data } = useEnergyFutureData();
  const [open, setOpen] = useState(false);
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
    const sector = intl.formatMessage({ id: `common.sectors.${config.sector}` }).toUpperCase();
    const scenario = intl.formatMessage({ id: `common.scenarios.${config.scenarios[0]}` }).toUpperCase();
    const unit = intl.formatMessage({ id: `common.units.${config.unit}` });
    const dataset = intl.formatMessage({ id: `common.dataset.${config.yearId}`, defaultMessage: config.yearId }).toUpperCase();
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
            [headers.value]: resource.value * conversionRatio,
            [headers.unit]: unit,
            [headers.dataset]: dataset,
          };
        default:
          throw new Error('Invalid data download.');
      }
    });

    saveAs(new Blob([Papa.unparse(csvData)], { type: 'text/csv;charset=utf-8;' }), 'energyFutures.csv');
  }, [config, intl, regionOrder, sourceOrder, data, headers]);
  const download = useMemo(() => ({
    name: intl.formatMessage({ id: 'components.share.download' }),
    content: downloadCSV,
  }), [intl, downloadCSV]);
  const copy = useMemo(() => ({
    name: 'copy',
    icon: <LinkIcon />,
    content: () => getBitlyURL().then((bitlyUrl) => {
      // TODO: Remove and change to use useRef and useEffect when the browser clipboard API
      // allows for asynchronous copies (https://github.com/zenorocha/clipboard.js/issues/639)
      const ref = document.createElement('div');
      const clipboard = new Clipboard(ref, { text: () => bitlyUrl });

      ref.click();
      setOpen(true);
      clipboard.destroy();
    }),
  }), [setOpen]);
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
  const groups = useMemo(
    () => [[download], [copy, linkedin, facebook, twitter, email]],
    [download, copy, email],
  );
  const onClose = useCallback(() => setOpen(false), [setOpen]);

  return (
    <>
      <LinkButtonGroup
        labels={groups}
        accent="right"
      />
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={onClose}
      >
        <Alert variant="filled" severity="info">
          {intl.formatMessage({ id: 'components.share.copied' })}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Share;
