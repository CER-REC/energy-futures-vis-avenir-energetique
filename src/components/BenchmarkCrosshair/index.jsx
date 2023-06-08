import React, { useEffect } from 'react';
import { Crosshair } from '@nivo/tooltip';
import PropTypes from 'prop-types';

const BenchmarkCrosshair = ({
  innerWidth,
  innerHeight,
  currentSlice,
  setSlice,
  slice,
}) => {
  let currPoint = null;

  if (slice) currPoint = slice;
  if (currentSlice) currPoint = currentSlice;

  useEffect(() => setSlice(currentSlice));

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
  } return null;
};

BenchmarkCrosshair.propTypes = {
  innerWidth: PropTypes.number.isRequired,
  innerHeight: PropTypes.number.isRequired,
  currentSlice: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  setSlice: PropTypes.func.isRequired,
  slice: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
};

BenchmarkCrosshair.defaultProps = {
  currentSlice: null,
  slice: null,
};

export default BenchmarkCrosshair;
