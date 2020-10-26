import React, { useMemo } from 'react';
import LinkIcon from '@material-ui/icons/Link';
import EmailIcon from '@material-ui/icons/Email';
import { useIntl } from 'react-intl';

import { IconTwitter, IconFacebook, IconLinkedIn } from '../../icons';
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
      labels={[[{ name: 'download data' }], [
        { icon: <LinkIcon />, name: 'Copy Link', content: () => {} },
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
