import { Button, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import Markdown from 'react-markdown';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import useConfig from '../../hooks/useConfig';

const useStyles = makeStyles({
  root: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const UnavailableDataMessage = ({ message, hasEmissionsLink = false }) => {
  const classes = useStyles();
  const intl = useIntl();
  const { configDispatch } = useConfig();

  return (
    <div className={classes.root}>
      <div>
        <Typography component="div"><Markdown>{message}</Markdown></Typography>
        {
          hasEmissionsLink && (
            <Button
              variant="text"
              color="primary"
              onClick={() => configDispatch({ type: 'yearId/changed', payload: 2023 })}
            >
              {intl.formatMessage({ id: 'components.unavailableData.emissionsLinkText' })}
            </Button>
          )
        }
      </div>
    </div>
  );
};

UnavailableDataMessage.propTypes = {
  message: PropTypes.string.isRequired,
  hasEmissionsLink: PropTypes.bool,
};

UnavailableDataMessage.defaultProps = {
  hasEmissionsLink: false,
};

export default UnavailableDataMessage;
