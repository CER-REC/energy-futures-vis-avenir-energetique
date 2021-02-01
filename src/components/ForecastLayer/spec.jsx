import React from 'react';
import { shallow } from 'enzyme';

import ForecastLayer from '.';

describe('Component|ForecastLayer', () => {
  let spy;
  let wrapper;

  describe('with no bar prop', () => {
    beforeEach(() => {
      spy = jest.fn(year => (year === 2000 ? 100 : 500));
      wrapper = shallow((
        <ForecastLayer
          height={1000}
          innerHeight={600}
          innerWidth={800}
          margin={{ top: 50 }}
          xScale={spy}
          forecastStart={2000}
          forecastLabel="test"
        />
      ));
    });

    test('should render a SVG group element', () => {
      expect(wrapper.type()).toBe('g');
    });

    test('should render the label', () => {
      expect(wrapper.text()).toBe('test');
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
      wrapper = shallow((
        <ForecastLayer
          bars={bars}
          height={800}
          margin={{ top: 50 }}
          xScale={spy}
          forecastStart={2020}
          forecastLabel="forecast"
        />
      ));
    });

    test('should render the x position using the xScale function and bar width', () => {
      expect(spy).toHaveBeenCalledWith(2020);
      expect(wrapper.prop('transform')).toContain('translate(21,');
    });
  });

  describe('with no forecastStart prop', () => {
    beforeEach(() => {
      spy = jest.fn();
      wrapper = shallow((
        <ForecastLayer
          height={1000}
          innerHeight={600}
          innerWidth={800}
          margin={{ top: 50 }}
          xScale={spy}
          forecastLabel="test"
        />
      ));
    });

    test('should not render', () => {
      expect(wrapper.type()).toBeNull();
    });
  });
});
