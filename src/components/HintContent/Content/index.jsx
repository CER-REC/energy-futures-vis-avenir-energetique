import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const Content = ({ title, description }) => (
  <Grid item xs={6}>
    <Typography variant="h6">
      {title}
    </Typography>
    <Typography variant="body2" color="secondary">
      {description}
    </Typography>
  </Grid>
);

Content.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Content;
