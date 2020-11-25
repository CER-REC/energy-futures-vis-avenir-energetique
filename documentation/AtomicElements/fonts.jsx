import React from 'react';
import PropTypes from 'prop-types';

const Fonts = props => (
  <>
    <h1> Fonts </h1>
    <div style={{ fontSize: props.fontSize }}>
      <span style={{ fontFamily: 'FiraSansCondensed' }}>Fira Sans Condensed regular</span>
      <br />
      <span style={{ fontFamily: 'FiraSansCondensedLight' }}>Fira Sans Condensed light</span>
      <br />
      <span style={{ fontFamily: 'FiraSansCondensedItalic' }}>Fira Sans Condensed italic</span>
      <br />
      <span style={{ fontFamily: 'FiraSansCondensedBold' }}>Fira Sans Condensed bold</span>
      <br />
    </div>
  </>
);

Fonts.propTypes = {
  fontSize: PropTypes.number.isRequired,
};

export default Fonts;
