import React, { useState } from 'react';
import { makeStyles, Paper, Grid, Button, Typography } from '@material-ui/core';
import { useIntl } from 'react-intl';
import InfoIcon from '@material-ui/icons/Info';
import useIsMobile from '../../hooks/useIsMobile';

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.blue.light,
    borderRadius: 10,
    padding: '8px',
    marginBottom: '24px',
  },
  icon: {
    color: theme.palette.blue.tealBlue,
    margin: '8px',
  },
  message: {
    color: theme.palette.blue.darkBluePurple,
  },
  button: {
    height: 'auto',
    width: '80%',
    maxWidth: '450px',
    marginLeft: '10%',
    backgroundColor: theme.palette.blue.tealBlue,
  },
}));

const Disclaimer = () => {
  const classes = useStyles();
  const intl = useIntl();
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const isMobile = useIsMobile();
  const handleClickCloseButton = () => setShowDisclaimer(false);

  return isMobile && showDisclaimer && (
    <Paper className={classes.paper} elevation={0}>
      <Grid container spacing={1} wrap='nowrap' alignItems='center'>
        <Grid item>
          <InfoIcon className={classes.icon} />
        </Grid>
        <Grid item container direction='column' spacing={1}>
          <Grid item>
            <Typography variant='body1' className={classes.message}>
              <b>{intl.formatMessage({ id: 'components.disclaimer.title' })}</b>
              &nbsp;-&nbsp;
              {intl.formatMessage({ id: 'components.disclaimer.body1' })}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant='contained'
              color="primary"
              disableRipple
              className={classes.button}
              onClick={handleClickCloseButton}
            >
              Close
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Disclaimer;
