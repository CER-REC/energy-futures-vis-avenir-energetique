import React, { useCallback, useMemo, useRef } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';
import useConfig from '../../hooks/useConfig';
import convertHexToRGB from '../../utilities/convertHexToRGB';
import analytics from '../../analytics';
import VizTooltip from '../../components/VizTooltip';
import { getMaxTick } from '../../utilities/parseData';
import { CHART_AXIS_PROPS, CHART_PROPS } from '../../constants';
import HistoricalLayer from '../../components/HistoricalLayer';
import ForecastLayer from '../../components/ForecastLayer';

// TODO: Remove data and sources when API is getting data correctly.

const data = [
  {
    year: '2005',
    AGRI: 68.1990104779,
    AIR: 0,
    BUILD: 85.206241865,
    ELECTRICITY: 122.967706,
    HEAVY: 83.8429496594,
    HYDROGEN: 0,
    LAND: 0,
    FOSSIL: 170.5208981544,
    TRANSPORTATION: 173.55735458,
    WASTE: 55.1973654256,
  },
  {
    year: '2006',
    AGRI: 67.7317246359,
    AIR: 0,
    BUILD: 80.311848043,
    ELECTRICITY: 124.5966742,
    HEAVY: 83.6233165984,
    HYDROGEN: 0,
    LAND: 0,
    FOSSIL: 175.5684574381,
    TRANSPORTATION: 172.73283528,
    WASTE: 54.3159750316,
  },
  {
    year: '2007',
    AGRI: 68.0060537239,
    AIR: 0,
    BUILD: 85.773291258,
    ELECTRICITY: 124.6844675,
    HEAVY: 82.1284159054,
    HYDROGEN: 0,
    LAND: 0,
    FOSSIL: 181.7526376548,
    TRANSPORTATION: 179.58808845,
    WASTE: 54.9015497226,
  },
  {
    year: '2008',
    AGRI: 67.5452119969,
    AIR: 0,
    BUILD: 85.381736392,
    ELECTRICITY: 110.5125799,
    HEAVY: 80.3295942864,
    HYDROGEN: 0,
    LAND: 0,
    FOSSIL: 180.4939806424,
    TRANSPORTATION: 175.5116566,
    WASTE: 53.2949897396,
  },
  {
    year: '2009',
    AGRI: 62.9830384269,
    AIR: 0,
    BUILD: 83.524342458,
    ELECTRICITY: 92.2940469,
    HEAVY: 67.4393550594,
    HYDROGEN: 0,
    LAND: -0.002126316,
    FOSSIL: 176.4284172884,
    TRANSPORTATION: 173.53072512,
    WASTE: 48.7250959006,
  },
  {
    year: '2010',
    AGRI: 64.3100651699,
    AIR: 0,
    BUILD: 80.28769062,
    ELECTRICITY: 87.1581886,
    HEAVY: 70.5212943994,
    HYDROGEN: 0,
    LAND: -0.003727737,
    FOSSIL: 184.2589501199,
    TRANSPORTATION: 177.03079067,
    WASTE: 48.8194953126,
  },
  {
    year: '2011',
    AGRI: 65.5549117259,
    AIR: 0,
    BUILD: 85.67629604,
    ELECTRICITY: 84.1779793,
    HEAVY: 74.8617681894,
    HYDROGEN: 0,
    LAND: -0.006640512,
    FOSSIL: 187.2667362482,
    TRANSPORTATION: 175.23987402,
    WASTE: 49.9550954076,
  },
  {
    year: '2012',
    AGRI: 67.1091892129,
    AIR: 0,
    BUILD: 83.96482063,
    ELECTRICITY: 71.8035379,
    HEAVY: 75.1102461825,
    HYDROGEN: 0,
    LAND: -0.01088715,
    FOSSIL: 197.3323134867,
    TRANSPORTATION: 177.35726487,
    WASTE: 49.9440606356,
  },
  {
    year: '2013',
    AGRI: 69.4551352889,
    AIR: 0,
    BUILD: 84.4503696,
    ELECTRICITY: 71.2749218,
    HEAVY: 73.052245608,
    HYDROGEN: 0,
    LAND: -0.01927258,
    FOSSIL: 203.1584230671,
    TRANSPORTATION: 179.33177794,
    WASTE: 50.4080065506,
  },
  {
    year: '2014',
    AGRI: 68.7456266479,
    AIR: 0,
    BUILD: 84.72052757,
    ELECTRICITY: 68.5820778,
    HEAVY: 73.7271667524,
    HYDROGEN: 0,
    LAND: -0.03715147,
    FOSSIL: 206.4567779249,
    TRANSPORTATION: 175.73893742,
    WASTE: 48.7338236646,
  },
  {
    year: '2015',
    AGRI: 70.9035361389,
    AIR: 0,
    BUILD: 83.1712474,
    ELECTRICITY: 74.4121359,
    HEAVY: 70.5025834274,
    HYDROGEN: 0,
    LAND: -0.05119662,
    FOSSIL: 206.8012183594,
    TRANSPORTATION: 173.54608559,
    WASTE: 49.9323852856,
  },
  {
    year: '2016',
    AGRI: 71.8615881159,
    AIR: 0,
    BUILD: 79.80325793,
    ELECTRICITY: 82.4008693,
    HEAVY: 70.4897194634,
    HYDROGEN: 0,
    LAND: -0.06742903,
    FOSSIL: 196.4125560083,
    TRANSPORTATION: 174.36842485,
    WASTE: 50.7302661986,
  },
  {
    year: '2017',
    AGRI: 70.8316003789,
    AIR: 0,
    BUILD: 83.73161534,
    ELECTRICITY: 81.6577543,
    HEAVY: 69.7082810404,
    HYDROGEN: 0,
    LAND: -0.09967883,
    FOSSIL: 198.7661307619,
    TRANSPORTATION: 180.53437872,
    WASTE: 52.1260596266,
  },
  {
    year: '2018',
    AGRI: 72.7288848319,
    AIR: 0,
    BUILD: 91.38427449,
    ELECTRICITY: 74.8779867,
    HEAVY: 70.4403592544,
    HYDROGEN: 0,
    LAND: -0.1408346,
    FOSSIL: 206.9021742982,
    TRANSPORTATION: 187.32229819,
    WASTE: 52.3568377876,
  },
  {
    year: '2019',
    AGRI: 72.0925545089,
    AIR: 0,
    BUILD: 87.68078507,
    ELECTRICITY: 72.219062,
    HEAVY: 69.6011937794,
    HYDROGEN: 0,
    LAND: -0.1638698,
    FOSSIL: 203.1835668209,
    TRANSPORTATION: 188.40680999,
    WASTE: 52.5804095972,
  },
  {
    year: '2020',
    AGRI: 73.1623876699,
    AIR: 0,
    BUILD: 83.3580612421,
    ELECTRICITY: 49.1644665,
    HEAVY: 63.5081761358,
    HYDROGEN: 0,
    LAND: -0.2701336,
    FOSSIL: 180.4932548519,
    TRANSPORTATION: 152.84656596,
    WASTE: 50.2110340036,
  },
  {
    year: '2021',
    AGRI: 68.6683997407,
    AIR: 0,
    BUILD: 81.0338666005,
    ELECTRICITY: 43.9501782,
    HEAVY: 66.5500481121,
    HYDROGEN: 0.3370830843,
    LAND: -3.400018,
    FOSSIL: 197.3706158382,
    TRANSPORTATION: 154.0817726,
    WASTE: 50.8151010471,
  },
  {
    year: '2022',
    AGRI: 70.6777924669,
    AIR: 0,
    BUILD: 81.8717774779,
    ELECTRICITY: 38.7354965,
    HEAVY: 68.2206610706,
    HYDROGEN: 0.6607944584,
    LAND: -6.516021,
    FOSSIL: 202.2724999246,
    TRANSPORTATION: 164.42684012,
    WASTE: 50.6269986948,
  },
  {
    year: '2023',
    AGRI: 70.5068759907,
    AIR: 0,
    BUILD: 80.379952367,
    ELECTRICITY: 33.6327488,
    HEAVY: 69.6512787762,
    HYDROGEN: 0.9771985129,
    LAND: -9.661074,
    FOSSIL: 197.5829039287,
    TRANSPORTATION: 165.97750215,
    WASTE: 48.8526826544,
  },
  {
    year: '2024',
    AGRI: 68.470060326,
    AIR: -2e-10,
    BUILD: 78.5923262484,
    ELECTRICITY: 28.3788686,
    HEAVY: 70.353437442,
    HYDROGEN: 1.2970286877,
    LAND: -12.78769,
    FOSSIL: 194.0542225934,
    TRANSPORTATION: 167.67098067,
    WASTE: 48.0925124776,
  },
  {
    year: '2025',
    AGRI: 67.4430047941,
    AIR: -1.8e-8,
    BUILD: 76.5909766918,
    ELECTRICITY: 23.0926925,
    HEAVY: 70.3264522072,
    HYDROGEN: 1.6187580064,
    LAND: -15.8809,
    FOSSIL: 186.0222705166,
    TRANSPORTATION: 167.23105733,
    WASTE: 47.1521293574,
  },
  {
    year: '2026',
    AGRI: 66.852685234,
    AIR: -4.198e-7,
    BUILD: 74.8357189966,
    ELECTRICITY: 19.915321,
    HEAVY: 67.6696639067,
    HYDROGEN: 1.8761397856,
    LAND: -18.93252,
    FOSSIL: 178.0703354709,
    TRANSPORTATION: 163.59452114,
    WASTE: 46.2994906917,
  },
  {
    year: '2027',
    AGRI: 66.3859851044,
    AIR: -0.000004608,
    BUILD: 72.9331266313,
    ELECTRICITY: 16.6440594,
    HEAVY: 66.7051440834,
    HYDROGEN: 2.1237545817,
    LAND: -21.95715,
    FOSSIL: 166.4057780576,
    TRANSPORTATION: 159.85953043,
    WASTE: 45.5091705398,
  },
  {
    year: '2028',
    AGRI: 65.9100399717,
    AIR: -0.0000307649,
    BUILD: 71.0564953472,
    ELECTRICITY: 13.5633704,
    HEAVY: 64.629660755,
    HYDROGEN: 2.3428531667,
    LAND: -24.96673,
    FOSSIL: 153.457023438,
    TRANSPORTATION: 154.37902951,
    WASTE: 44.4737028553,
  },
  {
    year: '2029',
    AGRI: 65.5741418589,
    AIR: -0.0001458788,
    BUILD: 69.1134385757,
    ELECTRICITY: 10.4736127,
    HEAVY: 58.7521680626,
    HYDROGEN: 2.626573177,
    LAND: -27.96896,
    FOSSIL: 138.7138071677,
    TRANSPORTATION: 149.18830638,
    WASTE: 43.4491064081,
  },
  {
    year: '2030',
    AGRI: 65.0641223164,
    AIR: -0.0005400465,
    BUILD: 67.0818757822,
    ELECTRICITY: 7.2189468,
    HEAVY: 54.1629310876,
    HYDROGEN: 2.949885531,
    LAND: -30.96782,
    FOSSIL: 124.2147332472,
    TRANSPORTATION: 141.99296838,
    WASTE: 42.3417007922,
  },
  {
    year: '2031',
    AGRI: 64.5946977773,
    AIR: -0.0024950708,
    BUILD: 65.363790931,
    ELECTRICITY: 4.3679228,
    HEAVY: 52.5240578173,
    HYDROGEN: 2.95246166,
    LAND: -31.96522,
    FOSSIL: 113.1903181639,
    TRANSPORTATION: 134.674155255,
    WASTE: 41.7887110628,
  },
  {
    year: '2032',
    AGRI: 64.1405811364,
    AIR: -0.0097468837,
    BUILD: 63.2042909772,
    ELECTRICITY: 1.4990999,
    HEAVY: 49.67101118,
    HYDROGEN: 2.649524095,
    LAND: -32.96198,
    FOSSIL: 103.1084664865,
    TRANSPORTATION: 127.372138419,
    WASTE: 41.2320638162,
  },
  {
    year: '2033',
    AGRI: 63.7194033735,
    AIR: -0.0313608102,
    BUILD: 61.0410664503,
    ELECTRICITY: -1.3841395,
    HEAVY: 46.6558832323,
    HYDROGEN: 2.262568478,
    LAND: -33.95849,
    FOSSIL: 92.4517643589,
    TRANSPORTATION: 120.004274588,
    WASTE: 40.5789385416,
  },
  {
    year: '2034',
    AGRI: 63.2873753783,
    AIR: -0.0857324953,
    BUILD: 58.6682902908,
    ELECTRICITY: -4.1433415,
    HEAVY: 42.0502224925,
    HYDROGEN: 1.583590774,
    LAND: -34.95489,
    FOSSIL: 81.1839653808,
    TRANSPORTATION: 112.75835058,
    WASTE: 39.7960738047,
  },
  {
    year: '2035',
    AGRI: 62.857182872,
    AIR: -0.2052162896,
    BUILD: 55.9683186883,
    ELECTRICITY: -7.0426973,
    HEAVY: 40.5754062531,
    HYDROGEN: -0.1703709899,
    LAND: -35.95124,
    FOSSIL: 72.984063993,
    TRANSPORTATION: 105.28918853,
    WASTE: 39.1292128136,
  },
  {
    year: '2036',
    AGRI: 62.3190461749,
    AIR: -0.4353374208,
    BUILD: 53.4644421108,
    ELECTRICITY: -9.2813335,
    HEAVY: 37.6494273792,
    HYDROGEN: -2.48821173,
    LAND: -36.9476,
    FOSSIL: 65.6929216817,
    TRANSPORTATION: 97.795622051,
    WASTE: 38.38989483,
  },
  {
    year: '2037',
    AGRI: 61.7126044287,
    AIR: -0.8404189465,
    BUILD: 51.3584533855,
    ELECTRICITY: -11.4770545,
    HEAVY: 34.1610230119,
    HYDROGEN: -4.05467184,
    LAND: -37.94397,
    FOSSIL: 60.7833436337,
    TRANSPORTATION: 90.611453041,
    WASTE: 37.6560638725,
  },
  {
    year: '2038',
    AGRI: 61.0754071554,
    AIR: -1.5004054695,
    BUILD: 49.1977699056,
    ELECTRICITY: -13.7081305,
    HEAVY: 30.0634838208,
    HYDROGEN: -5.57632793,
    LAND: -38.94037,
    FOSSIL: 56.2316906056,
    TRANSPORTATION: 83.779360119,
    WASTE: 36.874433804,
  },
  {
    year: '2039',
    AGRI: 60.4435342018,
    AIR: -2.5052157464,
    BUILD: 47.1337022758,
    ELECTRICITY: -15.9674578,
    HEAVY: 26.2812749277,
    HYDROGEN: -7.24794279,
    LAND: -39.9368,
    FOSSIL: 51.9626498749,
    TRANSPORTATION: 77.20756566,
    WASTE: 36.1279830699,
  },
  {
    year: '2040',
    AGRI: 59.8287662052,
    AIR: -3.9457231412,
    BUILD: 45.1290217149,
    ELECTRICITY: -18.2152108,
    HEAVY: 23.1120309003,
    HYDROGEN: -8.99230493,
    LAND: -40.93326,
    FOSSIL: 47.9289467313,
    TRANSPORTATION: 70.657122995,
    WASTE: 35.4003047901,
  },
  {
    year: '2041',
    AGRI: 59.1775216204,
    AIR: -5.8238776938,
    BUILD: 43.1182798172,
    ELECTRICITY: -20.1947689,
    HEAVY: 21.5910928031,
    HYDROGEN: -10.18815866,
    LAND: -41.92976,
    FOSSIL: 43.4148883878,
    TRANSPORTATION: 64.283506978,
    WASTE: 34.6022360407,
  },
  {
    year: '2042',
    AGRI: 58.5206819329,
    AIR: -8.1907389923,
    BUILD: 41.1415983405,
    ELECTRICITY: -22.1825265,
    HEAVY: 20.8417365684,
    HYDROGEN: -11.39569957,
    LAND: -42.92629,
    FOSSIL: 40.2543527413,
    TRANSPORTATION: 58.149734764,
    WASTE: 33.8177952628,
  },
  {
    year: '2043',
    AGRI: 57.8636927857,
    AIR: -11.0826221333,
    BUILD: 39.2443719087,
    ELECTRICITY: -24.1612992,
    HEAVY: 20.1714094471,
    HYDROGEN: -12.619138,
    LAND: -43.92285,
    FOSSIL: 37.4244567386,
    TRANSPORTATION: 52.341000622,
    WASTE: 33.0868763218,
  },
  {
    year: '2044',
    AGRI: 57.2194253866,
    AIR: -14.5189994696,
    BUILD: 37.4329140096,
    ELECTRICITY: -26.1710441,
    HEAVY: 19.6643332608,
    HYDROGEN: -13.84156509,
    LAND: -44.91945,
    FOSSIL: 34.7977923557,
    TRANSPORTATION: 46.758026193,
    WASTE: 32.3989930061,
  },
  {
    year: '2045',
    AGRI: 56.6040161524,
    AIR: -18.502574154,
    BUILD: 35.7412512191,
    ELECTRICITY: -28.1349038,
    HEAVY: 19.3741754986,
    HYDROGEN: -15.06061922,
    LAND: -45.91608,
    FOSSIL: 30.9607641147,
    TRANSPORTATION: 41.466838368,
    WASTE: 31.7552637728,
  },
  {
    year: '2046',
    AGRI: 55.9882453381,
    AIR: -23.0211784045,
    BUILD: 34.1742390606,
    ELECTRICITY: -30.5116552,
    HEAVY: 19.1094389084,
    HYDROGEN: -16.28881743,
    LAND: -46.91275,
    FOSSIL: 27.4116544433,
    TRANSPORTATION: 36.390422813,
    WASTE: 31.1479512863,
  },
  {
    year: '2047',
    AGRI: 55.3606297255,
    AIR: -28.0508313213,
    BUILD: 32.4914134047,
    ELECTRICITY: -32.8997789,
    HEAVY: 18.8717158786,
    HYDROGEN: -17.48987495,
    LAND: -47.90945,
    FOSSIL: 25.5636979093,
    TRANSPORTATION: 31.472353425,
    WASTE: 30.5740534353,
  },
  {
    year: '2048',
    AGRI: 54.7579037053,
    AIR: -33.559232293,
    BUILD: 31.1680154799,
    ELECTRICITY: -35.2566496,
    HEAVY: 18.6480087892,
    HYDROGEN: -18.67309252,
    LAND: -48.90618,
    FOSSIL: 23.8458150334,
    TRANSPORTATION: 26.801545876,
    WASTE: 30.0374421855,
  },
  {
    year: '2049',
    AGRI: 54.1915024515,
    AIR: -39.5091041515,
    BUILD: 29.9545218917,
    ELECTRICITY: -37.6027216,
    HEAVY: 18.4986137416,
    HYDROGEN: -19.84968843,
    LAND: -49.90295,
    FOSSIL: 22.0633890633,
    TRANSPORTATION: 22.389170734,
    WASTE: 29.5467794791,
  },
  {
    year: '2050',
    AGRI: 53.6617715264,
    AIR: -45.8610233992,
    BUILD: 28.8164840339,
    ELECTRICITY: -44,
    HEAVY: 18.364644671,
    HYDROGEN: -23,
    LAND: -50.89974,
    FOSSIL: 18,
    TRANSPORTATION: 17,
    WASTE: 29.082714205,
  },
];

const sources = {
  colors: {
    AGRI: '#AB5614',
    AIR: '#5DCA4F',
    BUILD: '#AB5614',
    ELECTRICITY: '#7ACBCB',
    HEAVY: '#FF821E',
    HYDROGEN: '#7A73B3',
    LAND: '#FC4169',
    FOSSIL: '#7A73B3',
    TRANSPORTATION: '#F2CB53',
    WASTE: '#4B5E5B',
  },
  order: [
    'AGRI',
    'AIR',
    'BUILD',
    'ELECTRICITY',
    'HEAVY',
    'HYDROGEN',
    'LAND',
    'FOSSIL',
    'TRANSPORTATION',
    'WASTE',
  ],
};

const Emissions = ({ year }) => {
  const { config } = useConfig();

  /**
   * Calculate bar colors.
   */
  const customColorProp = useCallback(
    () => d => convertHexToRGB(sources.colors[d.id], 0.75), [],
  );

  const colors = useMemo(
    () => customColorProp(year.max, year.forecastStart),
    [customColorProp, year],
  );

  // TODO: Add this back in when config has sources correctly.
  // const keys = useMemo(() => config.provinceOrder?.slice().reverse(), [config.provinceOrder]);

  /**
   * Format tooltip.
   */
  const timer = useRef(null);
  const getTooltip = useCallback((entry) => {
    // capture hover event and use a timer to avoid throttling
    const name = `${entry.id} - ${entry.indexValue}`;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => analytics.reportPoi(config.page, name), 500);
    return (
      <VizTooltip
        nodes={[{ name, value: entry.value, color: entry.color }]}
        unit={config.unit}
      />
    );
  }, [config.page, config.unit]);

  /**
   * Calculate the max tick value on y-axis and generate the all ticks accordingly.
   */
  const axis = useMemo(() => {
    const highest = data && Math.max(...data
      .map(seg => Object.values(seg).reduce((a, b) => a + (typeof b === 'string' ? 0 : b), 0)));
    return getMaxTick(highest);
  }, []);

  if (!data) {
    return null;
  }

  return (
    <div style={{ height: 700 }}>
      <ResponsiveBar
        {...CHART_PROPS}
        data={data}
        keys={sources.order.slice().reverse()}
        layers={[HistoricalLayer, 'grid', 'axes', 'bars', 'markers', ForecastLayer]}
        indexBy="year"
        maxValue={axis.highest}
        colors={colors}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisBottom={{
          ...CHART_AXIS_PROPS,
          format: yearLabel => ((yearLabel % 5) ? '' : yearLabel),
        }}
        axisRight={{
          ...CHART_AXIS_PROPS,
          tickValues: axis.ticks,
        }}
        tooltip={getTooltip}
        gridYValues={axis.ticks}
        motionStiffness={300}
        forecastStart={year.forecastStart}
        markers={[{
          axis: 'y',
          value: 0,
          lineStyle: { stroke: 'rgba(0,0,0,1)', strokeWidth: 3 },
        }]}
        annotations={[{
          type: 'line',
          offset: 4,
        }]}
      />
    </div>
  );
};

Emissions.propTypes = {
  year: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
    forecastStart: PropTypes.number,
  }),

};

Emissions.defaultProps = {
  year: {
    min: 0,
    max: 0,
    forecastStart: 0,
  },
};

export default Emissions;
