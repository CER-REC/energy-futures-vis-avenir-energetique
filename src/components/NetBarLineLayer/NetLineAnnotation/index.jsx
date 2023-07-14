import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

const DIAGONAL_MOVE = 20;
const HORIZONTAL_LENGTH = 30;
const FONT_SIZE = 13;

const NetLineAnnotation = ({ points }) => {
  const intl = useIntl();

  const startIndex = points.find(point => point.y)?.index || 0;
  const position = startIndex + Math.floor((points.length - startIndex) / 2);
  const midPoint = points[position];

  const textTop = (midPoint.y - DIAGONAL_MOVE - (FONT_SIZE / 2));
  const flip = ((position > points.length * 0.75) || (textTop < 0)) ? -1 : 1;

  const xPos = (DIAGONAL_MOVE + HORIZONTAL_LENGTH) * flip;
  const yPos = -DIAGONAL_MOVE * flip;

  const dashProps = {
    fill: 'none',
    stroke: '#9D948B',
    strokeDasharray: '4,4',
    strokeWidth: '2',
    d: `M 0,0 l ${DIAGONAL_MOVE * flip},${-DIAGONAL_MOVE * flip} h ${(HORIZONTAL_LENGTH - 2) * flip}`,
  };

  return (
    <g transform={`translate(${midPoint.x},${midPoint.y})`}>
      <path
        {...dashProps}
        stroke="#FFF"
        strokeWidth="3"

      />
      <path
        {...dashProps}
      />
      <text
        x={xPos}
        y={yPos}
        style={{ fontSize: FONT_SIZE, fontWeight: 'bold' }}
        stroke="#FFF"
        strokeWidth={dashProps.strokeWidth}
        paintOrder="stroke"
        textAnchor={flip === 1 ? 'start' : 'end'}
        alignmentBaseline="middle"
      >
        {intl.formatMessage({ id: 'common.netEmissions' })}
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
