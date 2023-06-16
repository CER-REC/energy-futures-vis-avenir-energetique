import {Button, makeStyles, Typography} from "@material-ui/core";
import React from "react";
import Markdown from "react-markdown";
import useConfig from "../../hooks/useConfig";
import {useIntl} from "react-intl";

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  }
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
              {intl.formatMessage({ id: `components.unavailableData.emissionsLinkText`})}
            </Button>
          )
        }
      </div>
    </div>
  )
}

export default UnavailableDataMessage;
