import React from 'react';
import PropTypes from 'prop-types';

const DIAGONAL_MOVE = 20;
const HORIZONTAL_LENGTH = 30;
const FONT_SIZE = 13;

const NetLineAnnotation = ({ points }) => {
  const midPoint = points[Math.ceil(points.length / 2)];
  const xPosText = DIAGONAL_MOVE + HORIZONTAL_LENGTH;
  const yPos = -((DIAGONAL_MOVE + FONT_SIZE) / 2);

  return (
    <g transform={`translate(${midPoint.x},${midPoint.y})`}>
      <path
        fill="none"
        stroke="#9D948B"
        strokeWidth="2"
        strokeDasharray="4,4"
        d={`M 0,0 l ${DIAGONAL_MOVE},-${DIAGONAL_MOVE} h ${HORIZONTAL_LENGTH - 2}`}
      />
      <text x={xPosText} y={yPos} style={{ fontSize: `${FONT_SIZE}px`, fontWeight: 'bold' }}>
        Net emissions
      </text>
    </g>
  );
};

NetLineAnnotation.propTypes = {
  points: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  })).isRequired,
};

export default NetLineAnnotation;
