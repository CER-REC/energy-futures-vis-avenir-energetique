import React from 'react';
import { Crosshair } from '@nivo/tooltip';
import PropTypes from 'prop-types';

const BenchmarkCrosshair =
  (handlePoint, point, isUpperChart) =>
  ({ innerWidth, innerHeight, currentSlice }) =>
{
  let currPoint = null;

  if (point !== null) currPoint = point;
  if (currentSlice !== null) currPoint = currentSlice;

  handlePoint(currentSlice, isUpperChart);

  if (currPoint !== null) {
    return (
      <Crosshair
        width={innerWidth}
        height={innerHeight}
        x={currPoint.x}
        y={currPoint.y}
        type='x'
      />
    );
  } return <></>;
};

BenchmarkCrosshair.propTypes = {
  innerWidth: PropTypes.number.isRequired,
  innerHeight: PropTypes.number.isRequired,
  currentSlice: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  handlePoint: PropTypes.func.isRequired,
  point: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  isUpperChart: PropTypes.bool.isRequired,
};

BenchmarkCrosshair.defaultProps = {
  currentSlice: null,
  point: null,
};

export default BenchmarkCrosshair;
