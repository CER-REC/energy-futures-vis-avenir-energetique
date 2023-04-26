import React from 'react';
import PropTypes from "prop-types";

const CandlestickBar = ({ x, y, width, height, color, data}) => {

  return (
    <g transform={`translate(${x}, ${y})`}>
      <path
        d={`M0 0 L0 10`}
        stroke="black"
        strokeWidth="1"
      />
      <rect width={width} height={height} fill={color}></rect>
    </g>
  )
}

CandlestickBar.propTypes = {
  bars: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
  }))
}

CandlestickBar.defaultProps = {
  bars: null
}

export default CandlestickBar;
