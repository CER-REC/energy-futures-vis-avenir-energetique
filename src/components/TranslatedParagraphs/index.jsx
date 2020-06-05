import React from 'react';
import PropTypes from 'prop-types';

const TranslatedParagraphs = ({ children, ...props }) => []
  .concat(children)
  .map((v) => {
    if (typeof v !== 'string') { return v; }
    // eslint-disable-next-line react/no-array-index-key
    return v.split('\n').map(line => <p key={line} {...props}>{line}</p>);
  });

TranslatedParagraphs.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

export default TranslatedParagraphs;
