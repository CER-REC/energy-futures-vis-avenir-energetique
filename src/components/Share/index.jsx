import React from 'react';
import LinkIcon from '@material-ui/icons/Link';
import EmailIcon from '@material-ui/icons/Email';

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

const openShareWindow = baseUrl => getBitlyURL().then(bitlyUrl => window.open(`${baseUrl}${bitlyUrl}`, 'targetWindow', 'width=650,height=650'));

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

const Share = () => (
  <LinkButtonGroup
    labels={[[{ name: 'download data' }], [
      { icon: <LinkIcon />, name: 'Copy Link', content: () => {} },
      linkedin,
      facebook,
      twitter,
      { icon: <EmailIcon />, name: 'Email', content: () => {} },
    ]]}
    accent="right"
  />
);

export default Share;
