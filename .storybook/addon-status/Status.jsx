import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const statusColors = {
  pendingDesign: '231, 41, 138',
  functionalityUnderDevelopment: '230, 171, 2', // Pending Feedback
  designUnderDevelopment: '31, 120, 180', // Under Development
  underReview: '106, 61, 154', // Developed
  changesRequested: '202, 178, 214', // Released
  approved: '102, 166, 30', // Approved Design
};

function capitalize(str) {
  return str.match(/((?:^.|[A-Z])[a-z]+)/g)
    .map(v => `${v.slice(0, 1).toUpperCase()}${v.slice(1)}`)
    .join(' ');
}

const Status = ({ name, note, children }) => (
  <>
    <div
      className="withStatus"
      style={{ borderLeftColor: `rgb(${statusColors[name]})` }}
    >
      <div
        className="title"
        style={{ background: `rgba(${statusColors[name]}, 0.1)` }}
      >
        Status: {capitalize(name)}
      </div>
      {note ? <div className="note">{note}</div> : null}
    </div>
    {children}
  </>
);

Status.propTypes = {
  name: PropTypes.oneOf(Object.keys(statusColors)).isRequired,
  note: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Status.defaultProps = {
  note: '',
};

export default Status;
