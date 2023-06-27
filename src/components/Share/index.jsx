import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  makeStyles, Grid, Button, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import LinkIcon from '@material-ui/icons/Link';
import EmailIcon from '@material-ui/icons/Email';
import Clipboard from 'clipboard';
import analytics from '../../analytics';

import { IconTwitter, IconFacebook, IconLinkedIn } from '../../icons';
import useConfig from '../../hooks/useConfig';

const getBitlyURL = () => {
  const bitlyServiceURL = `${document.location.origin}/bitlyService/api/bitlyShortlink`;

  return fetch(`${bitlyServiceURL}?shortenUrl=${encodeURIComponent(document.location.href)}`)
    .then(response => response.json())
    .then((data) => {
      if (!data?.data?.url) {
        throw new Error('Error retrieving Bitly shortened URL.');
      }

      return data.data.url;
    }).catch(() => document?.location.href);
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

const BUTTON_SIZE = 27;

const useStyles = makeStyles(theme => ({
  button: {
    'button&': {
      height: BUTTON_SIZE,
      width: BUTTON_SIZE,
      padding: theme.spacing(0, 2.5),
      '&:hover': { boxShadow: 'none' },
    },
    '& svg': { fontSize: 16 },
  },
}));

const Share = ({ direction, keepMounted }) => {
  const classes = useStyles();
  const intl = useIntl();
  const { config: { page } } = useConfig();

  const [openDialog, setOpenDialog] = useState('' /* shortened URL */);
  const [openToast, setOpenToast] = useState(false);

  /**
   * Create the Clipboard instance associated with the confirm dialog button.
   */
  useEffect(() => {
    new Clipboard('#copy-link-confirm-button'); // eslint-disable-line no-new
  }, []);

  /**
   * Determine whether or not Safari is in use.
   */
  const isSafari = useMemo(() => /^((?!chrome|android).)*safari/i.test(navigator.userAgent), []);

  const copy = useMemo(() => ({
    name: 'copy',
    icon: <LinkIcon />,
    content: () => getBitlyURL().then((bitlyUrl) => {
      // Due to the security restriction on Safari, the copy action needs to be triggered by
      // the user manually. Therefore it is handled in a confirm dialog.
      if (isSafari) {
        setOpenDialog(bitlyUrl);
        return;
      }

      // TODO: Remove and change to use useRef and useEffect when the browser clipboard API
      // allows for asynchronous copies (https://github.com/zenorocha/clipboard.js/issues/639)
      const ref = document.createElement('div');
      const clipboard = new Clipboard(ref, { text: () => bitlyUrl });

      ref.click();
      setOpenToast(true);
      clipboard.destroy();
    }),
  }), [isSafari, setOpenDialog, setOpenToast]);

  const email = useMemo(() => ({
    name: 'email',
    icon: <EmailIcon />,
    content: () => {
      getBitlyURL().then((bitlyUrl) => {
        const subject = intl.formatMessage({ id: 'common.title' });
        const message = intl.formatMessage({ id: 'components.share.emailMessage' });
        const body = `${encodeURIComponent(bitlyUrl)}%0A%0A${encodeURIComponent(message)}`;
        const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;

        window.location.href = emailUrl;
      });
    },
  }), [intl]);

  const buttons = useMemo(
    () => [copy, linkedin, facebook, twitter, email],
    [copy, email],
  );

  const onClose = useCallback(() => setOpenToast(false), [setOpenToast]);

  const onClick = (name, content) => {
    analytics.reportFooter(page, 'share', name);
    content();
  };

  return (
    <>
      <Grid container direction={direction}>
        {buttons.map(button => (
          <Button
            key={`social-button-${button.name}`}
            variant="contained"
            color="secondary"
            onClick={() => onClick(button.name, button.content)}
            className={classes.button}
          >
            {button.icon}
          </Button>
        ))}
      </Grid>

      {/* this is the confirm dialog that only appears in Safari */}
      <Dialog open={!!openDialog} keepMounted={keepMounted} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{intl.formatMessage({ id: 'components.share.dialog.description' })}</DialogTitle>
        <DialogContent style={{ wordBreak: 'break-all' }}>{openDialog}</DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setOpenDialog(false)}>
            {intl.formatMessage({ id: 'components.share.dialog.btnCancel' })}
          </Button>
          <Button
            id="copy-link-confirm-button"
            data-clipboard-text={openDialog}
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenToast(true);
              setOpenDialog(false);
            }}
          >
            {intl.formatMessage({ id: 'components.share.dialog.btnCopy' })}
          </Button>
        </DialogActions>
      </Dialog>

      {/* a toast as a visual indicator after the URL is copied successfully */}
      <Snackbar
        open={openToast}
        autoHideDuration={2000}
        onClose={onClose}
      >
        <Alert variant="filled" severity="info">
          <Typography>{intl.formatMessage({ id: 'components.share.copied' })}</Typography>
        </Alert>
      </Snackbar>
    </>
  );
};

Share.propTypes = {
  direction: PropTypes.string, // 'row' or 'column'
  keepMounted: PropTypes.bool,
};
Share.defaultProps = {
  direction: 'column',
  keepMounted: true,
};

export default Share;
