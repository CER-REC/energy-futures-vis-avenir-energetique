import convertHexToRGB from './convertHexToRGB';
import { convertUnit } from './convertUnit';
import getI18NMessages from './getI18NMessages';
import { NOOP, getTicks, validYear } from './parseData';

describe('Component|Utilities', () => {
  /**
   * convertHexToRGB
   */
  describe('Test convertHexToRGB', () => {
    test('should run method convertHexToRGB', () => {
      expect(convertHexToRGB('#6D60E8')).toBe('rgba(109, 96, 232, 1)');
      expect(convertHexToRGB('#6D60E8', 0.5)).toBe('rgba(109, 96, 232, 0.5)');
      expect(convertHexToRGB('#FFF')).toBe('#FFF');
    });
  });

  /**
   * convertUnit
   */
  describe('Test convertUnit', () => {
    test('should run method convertUnit', () => {
      expect(convertUnit('petajoules', 'kilobarrelEquivalents')).toBe(0.447);
      expect(convertUnit('gigawattHours', 'petajoules')).toBe(0.0036);
      expect(convertUnit('gigawattHours', 'kilobarrelEquivalents')).toBe(0.001611);
      expect(convertUnit('thousandCubicMetres', 'kilobarrels')).toBe(6.2898);
      expect(convertUnit('millionCubicMetres', 'cubicFeet')).toBe(0.035301);

      // invalid units; do not convert
      expect(convertUnit()).toBe(1);
    });
  });

  /**
   * getI18NMessages
   */
  describe('Test getI18NMessages', () => {
    test('should run method getI18NMessages', () => {
      const translations = [
        { group: 'ELECTRICITY_SOURCE', key: 'ALL', english: 'All', french: 'Tous' },
        { group: 'ENERGY_SOURCE', key: 'ALL', english: 'All', french: 'Tous' },
        { group: 'GAS_SOURCE', key: 'ALL', english: 'Total', french: 'Totale' },
        { group: 'OIL_SOURCE', key: 'ALL', english: 'Total', french: 'Totale' },
        { group: 'TRANSPORTATION_OIL_ENERGY_SOURCE', key: 'OIL', english: 'Other Oil Products', french: 'Autres produits pétroliers' },
        { group: 'SECTOR', key: 'ALL', english: 'Total Demand', french: 'Demande totale' },
        { group: 'ITERATION', key: '1', english: 'Canada’s Energy Future 2016', french: 'Avenir énergétique du Canada en 2016' },
        { group: 'REGION', key: 'ALL', english: 'Canada', french: 'Canada' },
        { group: 'SCENARIO', key: 'Evolving', english: 'Evolving', french: 'Évolution' },
      ];
      expect(getI18NMessages(translations)).toEqual({
        en: {
          'common.sources.electricity.ALL': 'All',
          'common.sources.energy.ALL': 'All',
          'common.sources.gas.ALL': 'Total',
          'common.sources.oil.ALL': 'Total',
          'common.sources.transportation.OIL': 'Other Oil Products',
          'common.sectors.ALL': 'Total Demand',
          'common.regions.ALL': 'Canada',
          'common.scenarios.Evolving': 'Evolving',
        },
        fr: {
          'common.sources.electricity.ALL': 'Tous',
          'common.sources.energy.ALL': 'Tous',
          'common.sources.gas.ALL': 'Totale',
          'common.sources.oil.ALL': 'Totale',
          'common.sources.transportation.OIL': 'Autres produits pétroliers',
          'common.sectors.ALL': 'Demande totale',
          'common.regions.ALL': 'Canada',
          'common.scenarios.Evolving': 'Évolution',
        },
      });
    });
  });

  /**
   * parseData
   */
  describe('Test parseData', () => {
    test('should run method NOOP', () => {
      expect(NOOP()).toEqual(undefined);
    });

    test('should run method getTicks', () => {
      expect(getTicks(37500)).toEqual([0, 5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000]);
      expect(getTicks(9000)).toEqual([0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000]);
      expect(getTicks(9)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should run method validYear', () => {
      expect(validYear(2000, { min: 2005, max: 2050 })).toEqual(2005);
      expect(validYear(2075, { min: 2005, max: 2050 })).toEqual(2050);
      expect(validYear(2020, { min: 2005, max: 2050 })).toEqual(2020);

      expect(validYear(2000)).toEqual(2000);
      expect(validYear(2075)).toEqual(2050);
      expect(validYear(2020)).toEqual(2020);

      expect(validYear()).toEqual(0);
    });
  });
});
