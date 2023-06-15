import React from 'react';
import { getRendered, mountWithIntl } from '../../tests/utilities';

import ForecastLayer from '.';

describe('Component|ForecastLayer', () => {
  let spy;
  let wrapper;

  describe('with no bar prop', () => {
    beforeEach(() => {
      spy = jest.fn(year => (year === 2000 ? 100 : 500));
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

  describe('with bar prop', () => {
    beforeEach(() => {
      const bars = [{
        data: { indexValue: '2019' },
        width: 10,
      }, {
        data: { indexValue: '2020' },
        width: 20,
      }, {
        data: { indexValue: '2021' },
        width: 30,
      }];

      spy = jest.fn(year => (year === 2020 ? 11 : 555));
      wrapper = mountWithIntl((
        <svg>
          <ForecastLayer
            bars={bars}
            height={800}
            width={600}
            padding={0}
            margin={{ top: 50 }}
            xScale={spy}
            forecastStart={2020}
          />
        </svg>
      ));
      wrapper = getRendered(ForecastLayer, wrapper);
    });

    test('should render the x position using the xScale function and bar width', () => {
      expect(spy).toHaveBeenCalledWith(2020);
      expect(wrapper.prop('transform')).toContain('translate(11,');
    });
  });

  describe('with no forecastStart prop', () => {
    beforeEach(() => {
      spy = jest.fn();
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
