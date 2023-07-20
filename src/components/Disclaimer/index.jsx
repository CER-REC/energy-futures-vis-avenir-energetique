import React, { useState } from 'react';
import { makeStyles, Paper, Grid, Button } from '@material-ui/core';
import { useIntl } from 'react-intl';
import InfoIcon from "@material-ui/icons/Info";
import useIsMobile from '../../hooks/useIsMobile';

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.blue.light,
    borderRadius: 10,
    padding: '0.5em 0.5em',
    marginBottom: '1.5rem',
  },
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    color: theme.palette.blue.tealBlue,
    margin: '1.5rem',
  },
  message: {
    color: theme.palette.blue.darkBluePurple,
  },
  button: {
    height: 'auto',
    width: '80%',
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
      <Grid contianer className={classes.root}>
        <Grid item>
          <InfoIcon className={classes.icon}/>
        </Grid>
        <Grid item container direction='column' spacing={1}>
          <Grid item>
            <span className={classes.message}>
              <b>{intl.formatMessage({ id: 'components.disclaimer.title' })}</b>
              &nbsp;-&nbsp;
              {intl.formatMessage({ id: 'components.disclaimer.body1' })}
            </span>
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
  )
};

export default Disclaimer;
