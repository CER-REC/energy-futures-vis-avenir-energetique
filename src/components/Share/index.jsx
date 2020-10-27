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
import LinkButtonGroup from '../LinkButtonGroup';

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
      saveAs(new Blob([Papa.unparse(data)], { type: 'text/csv' }), 'energyFutures.csv');
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
