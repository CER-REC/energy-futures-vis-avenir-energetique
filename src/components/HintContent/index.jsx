import React from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import Content from './Content';
import Header from './Header';

const useStyles = makeStyles(theme => ({
  content: { paddingLeft: theme.spacing(4.5) },
}));

const HintContent = ({ IconComponent, title, contents }) => {
  const classes = useStyles();

  return (
    <>
      {IconComponent && title && <Header IconComponent={IconComponent} title={title} />}
      <Grid item xs={12}>
        <Grid container className={classes.content} spacing={2}>
          {
            contents.map(content => (
              <Content
                key={content.title}
                title={content.title}
                description={content.description}
              />
            ))
          }
        </Grid>
      </Grid>
    </>
  );
};

HintContent.propTypes = {
  IconComponent: PropTypes.elementType,
  title: PropTypes.string,
  contents: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  })).isRequired,
};

HintContent.defaultProps = {
  IconComponent: null,
  title: '',
};

export default HintContent;
