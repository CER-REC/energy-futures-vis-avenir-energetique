import React from 'react';
import { getRendered, mountWithIntl } from '../../tests/utilities';

import ForecastLayer from '.';

const mockXScale = (xPosition) => {
  const xScale = jest.fn(() => xPosition);

  xScale.step = jest.fn(() => 1);
  xScale.padding = jest.fn(() => 0);

  return xScale;
};

describe('Component|ForecastLayer', () => {
  let spy;
  let wrapper;

  describe('with forecastStart prop', () => {
    beforeEach(() => {
      spy = mockXScale(100);

      wrapper = mountWithIntl((
        <svg>
          <ForecastLayer
            height={1000}
            width={1200}
            innerHeight={600}
            innerWidth={800}
            padding={0}
            margin={{ top: 50 }}
            xScale={spy}
            forecastStart={2000}
          />
        </svg>
      ));
      wrapper = getRendered(ForecastLayer, wrapper);
    });

    test('should render a SVG group element', () => {
      expect(wrapper.type()).toBe('g');
    });

    test('should render the label', () => {
      expect(wrapper.text()).not.toBe('');
    });

    test('should render the x position using the xScale function', () => {
      expect(spy).toHaveBeenCalledWith(2000);
      expect(wrapper.prop('transform')).toContain('translate(100,');
    });
  });

  describe('with no forecastStart prop', () => {
    beforeEach(() => {
      spy = mockXScale();
      wrapper = mountWithIntl((
        <svg>
          <ForecastLayer
            height={1000}
            width={1200}
            innerHeight={600}
            innerWidth={800}
            margin={{ top: 50 }}
            padding={0}
            xScale={spy}
          />
        </svg>
      ));
      wrapper = getRendered(ForecastLayer, wrapper);
    });

    test('should not render', () => {
      expect(wrapper.exists()).toBeFalsy();
    });
  });
});
