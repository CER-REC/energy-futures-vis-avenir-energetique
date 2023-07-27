import React, { useState, useEffect } from 'react';
import { makeStyles, Paper, Grid, Button, Typography } from '@material-ui/core';
import { useIntl } from 'react-intl';
import InfoIcon from '@material-ui/icons/Info';
import useIsMobile from '../../hooks/useIsMobile';
import { EXPIRY_MS } from '../../constants';

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
    maxWidth: '400px',
    backgroundColor: theme.palette.blue.tealBlue,
  },
}));

const expiryKey = 'ef.mobileDisclaimerSeenExpiryDate';
const remainderMS = localStorage.getItem(expiryKey) - new Date().getTime();

const Disclaimer = () => {
  const classes = useStyles();
  const intl = useIntl();
  const isMobile = useIsMobile();
  const [hasSeenDisclaimer, setHasSeenDisclaimer] = useState(remainderMS > 0);
  const handleClick = () => { setHasSeenDisclaimer(true); };

  useEffect(() => {
    if (hasSeenDisclaimer) {
      localStorage.setItem(expiryKey, new Date().getTime() + EXPIRY_MS);
    } else {
      localStorage.removeItem(expiryKey);
    }
  }, [hasSeenDisclaimer]);

  return isMobile && !hasSeenDisclaimer && (
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
          <Grid item style={{ textAlign: 'center' }}>
            <Button
              variant='contained'
              color="primary"
              disableRipple
              className={classes.button}
              onClick={handleClick}
            >
              {intl.formatMessage({ id: 'components.disclaimer.buttonClose' })}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Disclaimer;
