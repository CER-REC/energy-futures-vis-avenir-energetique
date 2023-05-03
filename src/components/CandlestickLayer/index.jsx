import React from 'react';
import PropTypes from 'prop-types';

const CandlestickLayer = ({ bars, data }) => {
  const years = data.map(obj => obj.year);

  const barMinMax = [];

  years.forEach((year) => {
    const filteredBars = bars.filter(bar => bar.data.indexValue === year);
    const { x } = filteredBars[0];
    const yMinMax = filteredBars
      .reduce((acc, curr) => [
        curr.y < acc[0].y ? curr : acc[0],
        curr.y > acc[1].y ? curr : acc[1],
      ], [{ y: Number.MAX_VALUE }, { y: Number.MIN_VALUE }]);

    barMinMax.push({
      year,
      x,
      yMin: yMinMax[0],
      yMax: yMinMax[1],
    });
  });

  const barLength = bars[0].width * 2;
  const barMoveX = (barLength - bars[0].width) / 2;

  return (
    <g>
      {
        barMinMax.map(obj => (
          <g
            key={obj.year}
            transform={`translate(${obj.x}, 0)`}
            stroke="black"
            strokeWidth="2"
          >
            <path
              d={`M-${barMoveX},${obj.yMax.y + obj.yMax.height} h ${barLength}`}
            />
            <path
              d={`M-${barMoveX},${obj.yMin.y} h ${barLength}`}
            />
          </g>
        ))
      }
    </g>
  );
};

CandlestickLayer.propTypes = {
  bars: PropTypes.arrayOf(PropTypes.shape({
    data: PropTypes.shape({
      indexValue: PropTypes.string.isRequired,
    }).isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  })),
  data: PropTypes.arrayOf(PropTypes.shape({
    year: PropTypes.string.isRequired,
  })).isRequired,
};

export default CandlestickLayer;
