import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ApolloProvider } from '@apollo/react-hooks';

import client from '../tests/mocks/apolloClient';
import mockData from '../tests/mocks/data.json';
import { initialState, getReducer } from './reducer';
import useAPI from './useAPI';
import useConfig from './useConfig';
import useEnergyFutureData from './useEnergyFutureData';
import { TestContainer } from '../tests/utilities';

const BASE_STATE = {
  baseYear: null,
  compareYear: null,
  mainSelection: 'energyDemand',
  noCompare: false,
  page: 'by-sector',
  provinceOrder: ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'],
  provinces: ['ALL'],
  scenarios: ['Reference'],
  sector: 'ALL',
  sourceOrder: ['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL'],
  sources: ['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL'],
  unit: 'petajoules',
  view: 'source',
  yearId: '2020',
};
const SOURCE_STATE = {
  ...BASE_STATE,
  page: 'electricity',
  view: 'source',
  mainSelection: 'electricityGeneration',
};
const PROVINCE_ORDER_ALT = ['AB', 'YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC'];
const SOURCE_ORDER_ALT = ['OIL', 'BIO', 'COAL', 'ELECTRICITY', 'GAS'];

describe('Component|hooks', () => {
  /**
   * reducer
   */
  describe('Test reducer', () => {
    const reducer = getReducer(
      { order: ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'] },
      {
        electricity: { order: ['BIO', 'COAL', 'GAS', 'HYDRO', 'NUCLEAR', 'OIL', 'RENEWABLE'] },
        energy: { order: ['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL'] },
        gas: { order: ['CBM', 'NA', 'SHALE', 'SOLUTION', 'TIGHT'] },
        oil: { order: ['C5', 'CONDENSATE', 'HEAVY', 'ISB', 'LIGHT', 'MB'] },
        transportation: { order: ['AVIATION', 'DIESEL', 'GASOLINE', 'OIL'] },
      },
      { order: ['ALL', 'TRANSPORTATION', 'RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL'] },
      {
        2016: { id: '1', year: 2016, scenarios: ['Reference', 'High Price', 'Low Price', 'Constrained', 'High LNG', 'No LNG'] },
        '2016*': { id: '2', year: 2016, scenarios: ['Reference', 'High Price', 'Low Price'] },
        2017: { id: '3', year: 2017, scenarios: ['Reference', 'Higher Carbon Price', 'Technology'] },
        2018: { id: '4', year: 2018, scenarios: ['Reference', 'Technology', 'High Price', 'Low Price'] },
        2019: { id: '5', year: 2019, scenarios: ['Reference'] },
        2020: { id: '6', year: 2020, scenarios: ['Evolving', 'Reference'] },
      },
    );

    test('should make page, main selection, unit, and yearId changes', () => {
      expect(reducer(initialState, { type: 'page/changed', payload: 'landing' })).toEqual(initialState);
      expect(reducer(initialState, { type: 'page/changed', payload: 'electricity' }).page).toEqual('electricity');

      expect(reducer({ page: 'by-sector' }, { type: 'mainSelection/changed', payload: 'energyDemand' }).mainSelection).toEqual('energyDemand');
      expect(reducer({ mainSelection: 'energyDemand' }, { type: 'unit/changed', payload: 'petajoules' }).unit).toEqual('petajoules');

      expect(reducer({ page: 'by-sector' }, { type: 'yearId/changed', payload: '2019' }).yearId).toEqual('2019');
      expect(reducer({ page: 'landing' }, { type: 'yearId/changed', payload: '2019' }).yearId).toBeNull();
    });

    test('should make view, sector, and scenario changes', () => {
      expect(reducer({ page: 'electricity' }, { type: 'view/changed', payload: 'source' }).view).toEqual('source');
      expect(reducer({ page: 'by-sector' }, { type: 'view/changed', payload: 'source' }).view).toBeNull();

      expect(reducer({ page: 'by-sector' }, { type: 'sector/changed', payload: 'TRANSPORTATION' }).sector).toEqual('TRANSPORTATION');
      expect(reducer({ page: 'by-electricity' }, { type: 'sector/changed', payload: 'TRANSPORTATION' }).sector).toBeNull();

      expect(reducer({ page: 'by-sector', yearId: 2020 }, { type: 'scenarios/changed', payload: ['Reference'] }).scenarios).toEqual(['Reference']);
      expect(reducer({ page: 'landing', yearId: 2020 }, { type: 'scenarios/changed', payload: ['Reference'] }).scenarios).toBeNull();
    });

    test('should make province and source changes', () => {
      expect(reducer(BASE_STATE, { type: 'provinces/changed', payload: [] }).provinces).toHaveLength(0);
      expect(reducer({ ...BASE_STATE, view: 'region' }, { type: 'provinces/changed', payload: ['AB'] }).provinces).toEqual(['AB']);
      expect(reducer({ ...BASE_STATE, page: 'landing' }, { type: 'provinces/changed', payload: [] }).provinces).toBeNull();

      expect(reducer(BASE_STATE, { type: 'provinceOrder/changed', payload: PROVINCE_ORDER_ALT }).provinceOrder).toEqual(PROVINCE_ORDER_ALT);
      expect(reducer({ ...BASE_STATE, page: 'landing' }, { type: 'provinceOrder/changed', payload: PROVINCE_ORDER_ALT }).provinceOrder).toBeNull();

      expect(reducer(BASE_STATE, { type: 'sources/changed', payload: [] }).sources).toHaveLength(0);
      expect(reducer(SOURCE_STATE, { type: 'sources/changed', payload: ['OIL'] }).sources).toEqual(['OIL']);
      expect(reducer(SOURCE_STATE, { type: 'sources/changed', payload: ['ALL'] }).sources).toEqual(['ALL']);
      expect(reducer({ ...BASE_STATE, page: 'landing' }, { type: 'sources/changed', payload: [] }).sources).toBeNull();

      expect(reducer(BASE_STATE, { type: 'sourceOrder/changed', payload: SOURCE_ORDER_ALT }).sourceOrder).toEqual(SOURCE_ORDER_ALT);
      expect(reducer({ ...BASE_STATE, page: 'landing' }, { type: 'sourceOrder/changed', payload: SOURCE_ORDER_ALT }).sourceOrder).toBeNull();
    });

    test('should make year value and compare changes', () => {
      expect(reducer({ ...BASE_STATE, page: 'oil-and-gas' }, { type: 'baseYear/changed', payload: 2050 }).baseYear).toEqual(2050);

      expect(reducer({ ...BASE_STATE, page: 'oil-and-gas' }, { type: 'compareYear/changed', payload: 2050 }).compareYear).toEqual(2050);

      expect(reducer({ ...BASE_STATE, page: 'oil-and-gas' }, { type: 'noCompare/changed', payload: true }).noCompare).toBeTruthy();

      expect(reducer(initialState, { type: 'invalid', payload: '' })).toEqual(initialState);
    });
  });

  /**
   * useAPI
   */
  describe('Test useAPI', () => {
    const MockComponent = () => {
      const { yearIdIterations, regions, sources, sectors } = useAPI();
      return (
        <>
          <div id="years">{Object.keys(yearIdIterations).map(year => <span key={`year-${year}`}>{year}</span>)}</div>
          <div id="regions">{regions.order.map(region => <span key={`region-${region}`}>{region}</span>)}</div>
          <div id="sources">{Object.keys(sources).map(source => <span key={`source-${source}`}>{source}</span>)}</div>
          <div id="sectors">{sectors.order.map(sector => <span key={`sector-${sector}`}>{sector}</span>)}</div>
        </>
      );
    };
    const wrapper = mount(<ApolloProvider client={client}><MockComponent /></ApolloProvider>);
    test('should load hook content', async () => {
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();

        expect(wrapper.find('#years > span').map(node => node.text())).toEqual(expect.arrayContaining(['2016', '2017', '2018', '2019', '2020', '2016*']));
        expect(wrapper.find('#regions > span').map(node => node.text())).toEqual(BASE_STATE.provinceOrder);
        expect(wrapper.find('#sources > span').map(node => node.text())).toEqual(['electricity', 'energy', 'gas', 'oil', 'transportation']);
        expect(wrapper.find('#sectors > span').map(node => node.text())).toEqual(['ALL', 'TRANSPORTATION', 'RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL']);
      });
    });
  });

  /**
   * useConfig
   */
  describe('Test useConfig', () => {
    const MockComponent = () => <>{JSON.stringify(useConfig().config)}</>;
    const wrapper = mount(<TestContainer mockConfig={BASE_STATE}><MockComponent /></TestContainer>);
    test('should load hook content', async () => {
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();

        expect(wrapper.type()).not.toBeNull();
        expect(wrapper.text()).toEqual(JSON.stringify(BASE_STATE));
      });
    });
  });

  /**
   * useEnergyFutureData
   */
  describe('Test useEnergyFutureData', () => {
    let wrapper;
    const getComponent = (props) => {
      const MockComponent = () => <>{JSON.stringify(useEnergyFutureData())}</>;
      return (
        <TestContainer mockConfig={{ ...BASE_STATE, ...props }}>
          <MockComponent />
        </TestContainer>
      );
    };

    test('should load hook content', async () => {
      const parseRegions = content => Object.keys(JSON.parse(content).data[0]).filter(key => key !== 'year');
      const year = { min: 2005, forecastStart: 2018, max: 2005 };

      // by-region page
      await act(async () => {
        wrapper = mount(getComponent({ page: 'by-region' }));
        await new Promise(resolve => setTimeout(resolve, 100));
        wrapper.update();
        expect(parseRegions(wrapper.text())).toHaveLength(mockData.data.resources.length);

        wrapper = mount(getComponent({ page: 'by-region', mainSelection: 'oilProduction' }));
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(parseRegions(wrapper.text())).toHaveLength(mockData.data.resources.length);

        wrapper = mount(getComponent({ page: 'by-region', mainSelection: 'gasProduction' }));
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(parseRegions(wrapper.text())).toHaveLength(mockData.data.resources.length);

        wrapper = mount(getComponent({ page: 'by-region', mainSelection: 'electricityGeneration' }));
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(parseRegions(wrapper.text())).toHaveLength(mockData.data.resources.length);

        wrapper = mount(getComponent({ page: 'by-region', mainSelection: 'invalid' }));
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        expect(JSON.parse(wrapper.text()).data).toBeUndefined();
      });

      // by-sector page and other settings
      await act(async () => {
        wrapper = mount(getComponent({ sector: 'TRANSPORTATION' }));
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();

        expect(JSON.parse(wrapper.text()).data[0].id).toEqual('BIO');
        expect(JSON.parse(wrapper.text()).data[0].data).toBeDefined();

        wrapper = mount(getComponent({ sources: ['ALL'] }));
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();

        expect(JSON.parse(wrapper.text()).data[0].id).toEqual('BIO');
        expect(JSON.parse(wrapper.text()).data[0].data).toBeDefined();
      });

      // scenarios page
      await act(async () => {
        wrapper = mount(getComponent({ page: 'scenarios' }));
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();

        expect(JSON.parse(wrapper.text()).data).toBeDefined();
        expect(JSON.parse(wrapper.text()).year).toEqual(year);
      });

      // electricity page
      await act(async () => {
        wrapper = mount(getComponent({ page: 'electricity' }));
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();

        expect(JSON.parse(wrapper.text()).data[2005]).toBeDefined();
        expect(JSON.parse(wrapper.text()).year).toEqual(year);

        wrapper = mount(getComponent({ ...SOURCE_STATE, view: 'region' }));
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();

        expect(JSON.parse(wrapper.text()).data[2005]).toBeDefined();
        expect(JSON.parse(wrapper.text()).year).toEqual(year);
      });

      // oil-and-gas page
      await act(async () => {
        wrapper = mount(getComponent({ page: 'oil-and-gas' }));
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();

        expect(JSON.parse(wrapper.text()).data[2005]).toBeDefined();
        expect(JSON.parse(wrapper.text()).year).toEqual(year);
      });

      // landing page
      await act(async () => {
        wrapper = mount(getComponent({ page: 'landing' }));
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();

        expect(JSON.parse(wrapper.text()).data).toBeUndefined();
      });
    });
  });
});
