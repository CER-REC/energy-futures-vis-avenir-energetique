import convertHexToRGB from './convertHexToRGB';
import { convertUnit, formatUnitAbbreviation } from './convertUnit';
import getI18NMessages from './getI18NMessages';
import { parseData, NOOP, getMaxTick, validYear } from './parseData';

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

    test('should run method formatUnitAbbreviation', () => {
      expect(formatUnitAbbreviation(12345.67, 'PJ', { locale: 'en' })).toBe('12,345.67 PJ');
      expect(formatUnitAbbreviation(12345.67, 'PJ', { locale: 'fr' })).not.toBeNull();
      expect(formatUnitAbbreviation(12345.67, 'Mboe/d', { locale: 'en' })).toBe('12.35 MMboe/d');
      expect(formatUnitAbbreviation(12345.67, 'Mboe/d', { locale: 'fr' })).not.toBeNull();
      expect(formatUnitAbbreviation(0.12345, 'Mboe/d', { locale: 'en' })).toBe('0.123 Mboe/d');
      expect(formatUnitAbbreviation(0.12345, 'Mboe/d', { locale: 'fr' })).not.toBeNull();
      expect(formatUnitAbbreviation(0.12345, undefined, { locale: 'en' })).toBe('0.12');
      expect(formatUnitAbbreviation(0.12345, undefined, { locale: 'fr' })).not.toBeNull();
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
    test('should run method parseData.by-sector', () => {
      const data = [
        { year: 2005, value: 657.2514, source: 'BIO' },
        { year: 2005, value: 191.0725, source: 'COAL' },
        { year: 2005, value: 1830.7712, source: 'ELECTRICITY' },
        { year: 2005, value: 3256.5436, source: 'GAS' },
        { year: 2005, value: 4559.9494, source: 'OIL' },
        { year: 2050, value: 866.6818, source: 'BIO' },
        { year: 2050, value: 49.9152, source: 'COAL' },
        { year: 2050, value: 2640.4333, source: 'ELECTRICITY' },
        { year: 2050, value: 3102.7858, source: 'GAS' },
        { year: 2050, value: 3304.9447, source: 'OIL' },
      ];
      expect(parseData['by-sector'](data, 1)).toEqual([
        { id: 'BIO', data: [{ x: 2005, y: 657.2514 }, { x: 2050, y: 866.6818 }] },
        { id: 'COAL', data: [{ x: 2005, y: 191.0725 }, { x: 2050, y: 49.9152 }] },
        { id: 'ELECTRICITY', data: [{ x: 2005, y: 1830.7712 }, { x: 2050, y: 2640.4333 }] },
        { id: 'GAS', data: [{ x: 2005, y: 3256.5436 }, { x: 2050, y: 3102.7858 }] },
        { id: 'OIL', data: [{ x: 2005, y: 4559.9494 }, { x: 2050, y: 3304.9447 }] },
      ]);
    });

    test('should run method parseData.by-region', () => {
      const data = [
        { province: 'NL', year: 2005, scenario: 'Evolving', value: 42314.6543 },
        { province: 'PE', year: 2005, scenario: 'Evolving', value: 40.879 },
        { province: 'NS', year: 2005, scenario: 'Evolving', value: 11780.6651 },
        { province: 'NB', year: 2005, scenario: 'Evolving', value: 17566.8159 },
        { province: 'BC', year: 2050, scenario: 'Evolving', value: 109460.5979024 },
        { province: 'YT', year: 2050, scenario: 'Evolving', value: 504.2719 },
        { province: 'NT', year: 2050, scenario: 'Evolving', value: 344.0911776 },
        { province: 'NU', year: 2050, scenario: 'Evolving', value: 312.0619 },
      ];
      expect(parseData['by-region'](data, 1)).toEqual([
        { year: '2005', NL: 42314.6543, PE: 40.879, NS: 11780.6651, NB: 17566.8159 },
        { year: '2050', BC: 109460.5979024, YT: 504.2719, NT: 344.0911776, NU: 312.0619 },
      ]);
    });

    test('should run method parseData.scenarios', () => {
      const data = [
        { province: 'ALL', year: 2005, scenario: 'Evolving', value: 10495.5881 },
        { province: 'ALL', year: 2006, scenario: 'Evolving', value: 10483.1437 },
        { province: 'ALL', year: 2007, scenario: 'Evolving', value: 10821.7113 },
        { province: 'ALL', year: 2048, scenario: 'Evolving', value: 10124.3517 },
        { province: 'ALL', year: 2049, scenario: 'Evolving', value: 10043.8959 },
        { province: 'ALL', year: 2050, scenario: 'Evolving', value: 9964.7608 },
      ];
      expect(parseData.scenarios(data, 1, ['ALL'])[0].data).toEqual([
        { x: 2005, y: 10495.5881 },
        { x: 2006, y: 10483.1437 },
        { x: 2007, y: 10821.7113 },
        { x: 2048, y: 10124.3517 },
        { x: 2049, y: 10043.8959 },
        { x: 2050, y: 9964.7608 },
      ]);
    });

    test('should run method parseData.electricity', () => {
      const data = [
        { province: 'NL', year: 2005, source: 'BIO', value: 0 },
        { province: 'NL', year: 2005, source: 'COAL', value: 0 },
        { province: 'NL', year: 2005, source: 'HYDRO', value: 40741.37 },
        { province: 'NL', year: 2005, source: 'GAS', value: 267.0709 },
        { province: 'YT', year: 2045, source: 'BIO', value: 11.3042 },
        { province: 'YT', year: 2045, source: 'COAL', value: 0 },
        { province: 'YT', year: 2045, source: 'HYDRO', value: 413.4744 },
        { province: 'YT', year: 2045, source: 'GAS', value: 0 },
      ];

      // view by region
      expect(parseData.electricity(
        data,
        0.0036,
        ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'],
        ['BIO', 'COAL', 'GAS', 'HYDRO', 'NUCLEAR', 'OIL', 'RENEWABLE'],
        'region',
      )).toEqual({
        2005: { NL: [{ name: 'HYDRO', value: 146.668932 }, { name: 'GAS', value: 0.9614552399999999 }] },
        2045: { YT: [{ name: 'BIO', value: 0.04069512 }, { name: 'HYDRO', value: 1.48850784 }] },
      });

      // view by source
      expect(parseData.electricity(
        data,
        0.0036,
        ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'],
        ['BIO', 'COAL', 'GAS', 'HYDRO', 'NUCLEAR', 'OIL', 'RENEWABLE'],
        'source',
      )).toEqual({
        2005: { HYDRO: [{ name: 'NL', value: 146.668932 }], GAS: [{ name: 'NL', value: 0.9614552399999999 }] },
        2045: { BIO: [{ name: 'YT', value: 0.04069512 }], HYDRO: [{ name: 'YT', value: 1.48850784 }] },
      });
    });

    test('should run method parseData.oil-and-gas', () => {
      const data = [
        { province: 'NL', year: 2005, source: 'C5', value: 0 },
        { province: 'NL', year: 2005, source: 'CONDENSATE', value: 0 },
        { province: 'NL', year: 2005, source: 'HEAVY', value: 0 },
        { province: 'NL', year: 2005, source: 'ISB', value: 0 },
        { province: 'NL', year: 2005, source: 'LIGHT', value: 48.47 },
        { province: 'NL', year: 2005, source: 'MB', value: 0 },
      ];

      // view by region
      expect(parseData['oil-and-gas'](data, 6.2898, null, null, 'region')['2005']).toEqual([
        { name: 'NL', total: 304.866606, children: [{ name: 'LIGHT', value: 304.866606 }] },
      ]);

      // view by source
      expect(parseData['oil-and-gas'](data, 6.2898, null, null, 'source')['2005']).toEqual([
        { name: 'C5', total: 0, children: [] },
        { name: 'CONDENSATE', total: 0, children: [] },
        { name: 'HEAVY', total: 0, children: [] },
        { name: 'ISB', total: 0, children: [] },
        { name: 'LIGHT', total: 304.866606, children: [{ name: 'NL', value: 304.866606 }] },
        { name: 'MB', total: 0, children: [] },
      ]);
    });

    test('should run method NOOP', () => {
      expect(NOOP()).toEqual(undefined);
    });

    test('should run method getMaxTick', () => {
      expect(getMaxTick(37500)).toEqual({
        highest: 37500,
        max: 40000,
        step: 5000,
        ticks: [0, 5000, 10000, 15000, 20000, 25000, 30000, 37500],
      });
      expect(getMaxTick(9000)).toEqual({
        highest: 9000,
        max: 9000,
        step: 1000,
        ticks: [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000],
      });
      expect(getMaxTick(9)).toEqual({
        highest: 9,
        max: 9,
        step: 1,
        ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      });

      // invalid highest value; return default
      expect(getMaxTick()).toEqual({
        highest: undefined,
        max: 'auto',
        step: undefined,
        ticks: [undefined],
      });
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
