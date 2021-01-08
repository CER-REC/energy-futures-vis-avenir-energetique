import React from 'react';
import { useIntl } from 'react-intl';
import { makeStyles, createStyles, Typography } from '@material-ui/core';
import propTypes from 'prop-types';

const screenPath = (
  <path
    d="
      M 443.714,411.486
      H 320.286
      A 10.291,10.291,0,0,0,310,421.787
      v 82.389
      a 10.291,10.291,0,0,0,10.286,10.3
      h 46.286
      v 10.139
      H 356.286
      a 5.143,5.143,0,1,0,0,10.286
      h 51.429
      a 5.143,5.143,0,1,0,0-10.286
      H 397.429
      V 514.476
      h 46.286
      A 10.291,10.291,0,0,0,454,504.175
      V 421.787
      A 10.291,10.291,0,0,0,443.714,411.486
      Z

      m 0,89.633
      a 3.217,3.217,0,0,1-3.218,3.218
      H 323.5
      a 3.217,3.217,0,0,1-3.218-3.218
      V 425.166
      a 3.217,3.217,0,0,1,3.218-3.218
      H 440.511
      a 3.217,3.217,0,0,1,3.218,3.218
      l -.015,75.953
      Z"
  />
);

const iconPath = (
  <path
    d="
      M 370.725,492.765,345.489,467.53
      a 3.883,3.883,0,0,1,0-5.491
      l 5.49-5.491
      a 3.882,3.882,0,0,1,5.491,0
      l 17,17,36.412-36.412
      a 3.883,3.883,0,0,1,5.491,0
      l 5.49,5.491
      a 3.883,3.883,0,0,1,0,5.491
      l -44.647,44.647
      a 3.882,3.882,0,0,1-5.491,0
      Z
    "
  />
);

const useStyles = makeStyles(theme => createStyles({
  root: {
    maxWidth: 750,
    margin: `${theme.spacing(1.5)}px auto`,
    padding: theme.spacing(2),
    textAlign: 'center',

    '& svg': {
      width: 150,
      height: 'auto',

      stroke: theme.palette.grey[600],
      fill: theme.palette.grey[600],
      strokeLinejoin: 'round',
      strokeLinecap: 'round',
    },

    '& p': {
      fontSize: 16,
      fontFamily: 'FiraSansCondensedLight',
      color: theme.palette.grey[800],
      marginTop: '1em',
    },
  },
}));

const UnsupportedWarning = ({ type }) => {
  const classes = useStyles();
  const intl = useIntl();

  return (
    <div className={`${classes.root} UnsupportedWarning`}>
      <svg viewBox="282 400 200 150">
        <g>
          {screenPath}
          {iconPath}
        </g>
      </svg>
      <Typography variant="body1">
        {intl.formatMessage({ id: `components.unsupportedWarning.${type}` })}
      </Typography>
    </div>
  );
};

UnsupportedWarning.propTypes = {
  type: propTypes.oneOf(['resolution', 'browser']).isRequired,
};

export default UnsupportedWarning;
