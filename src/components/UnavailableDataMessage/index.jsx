import { Button, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import Markdown from 'react-markdown';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import useConfig from '../../hooks/useConfig';
import useAPI from '../../hooks/useAPI';

const useStyles = makeStyles({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
});

const UnavailableDataMessage = ({ message, hasEmissionsLink }) => {
  const classes = useStyles();
  const intl = useIntl();
  const { configDispatch } = useConfig();
  const { yearIdIterations } = useAPI();

  let currMessage = message;
  let emissionsLinkMessage = null;

  if (hasEmissionsLink) {
    const values = Object.values(yearIdIterations);
    const latestYear = values.find(year => year.id === values.length.toString()).year;

    currMessage = intl.formatMessage(
      { id: 'common.unavailableData.emissionsUnavailable' },
      { year: latestYear },
    );

    emissionsLinkMessage = intl.formatMessage(
      { id: 'common.unavailableData.emissionsLinkText' },
      { year: latestYear },
    );
  }

  return (
    <div className={classes.root}>
      <Typography component="div"><Markdown>{currMessage}</Markdown></Typography>
      {
        hasEmissionsLink && (
          <Button
            variant="text"
            color="primary"
            onClick={() => configDispatch({ type: 'yearId/changed' })}
          >
            {emissionsLinkMessage}
          </Button>
        )
      }
    </div>
  );
};

UnavailableDataMessage.propTypes = {
  message: PropTypes.string,
  hasEmissionsLink: PropTypes.bool,
};

UnavailableDataMessage.defaultProps = {
  message: null,
  hasEmissionsLink: false,
};

export default UnavailableDataMessage;
