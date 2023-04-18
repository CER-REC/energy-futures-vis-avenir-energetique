import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Button } from '@material-ui/core';
import React from 'react';
import { saveAs } from 'file-saver';
import { getRendered, TestContainer } from '../../tests/utilities';
import DownloadButton from './index';

const DEFAULT_CONFIG = {
  page: 'by-region',
  mainSelection: 'energyDemand',
  yearId: '2020',
  scenarios: ['Evolving'],
  view: 'region',
  unit: 'petajoules',
  provinces: ['AB'],
  provinceOrder: ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'],
};

const getDownloadComponent = (props, options = {}) => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
    <DownloadButton {...options} />
  </TestContainer>
);

describe('Component|DownloadButton|By-Region', () => {
  let wrapper;

  beforeEach(async () => {
    const dom = mount(getDownloadComponent({ page: 'by-region' }));
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve));
      dom.update();
      wrapper = getRendered(DownloadButton, dom);
    });
  });

  test('should render component', () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  test('should render text', () => {
    const button = wrapper.find(Button);

    expect(button.length).toBe(1);
    expect(button.text()).toBe('Download Data');
  });

  test('should call saveAs', () => {
    const downloadButton = wrapper.find(Button);
    downloadButton.simulate('click');
    expect(saveAs).toBeCalled();
  });
});

describe('Component|DownloadButton|By-Sector', () => {
  let wrapper;

  test('should call saveAs', async () => {
    const dom = mount(getDownloadComponent({ page: 'by-sector', sources: ['BIO'], sector: 'ALL' }));
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve));
      dom.update();
      wrapper = getRendered(DownloadButton, dom);
    });

    const downloadButton = wrapper.find(Button);
    downloadButton.simulate('click');
    expect(saveAs).toBeCalled();
  });
});

describe('Component|DownloadButton|Scenarios', () => {
  let wrapper;

  test('should call saveAs', async () => {
    const dom = mount(getDownloadComponent({ page: 'scenarios' }));
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve));
      dom.update();
      wrapper = getRendered(DownloadButton, dom);
    });

    const downloadButton = wrapper.find(Button);
    downloadButton.simulate('click');
    expect(saveAs).toBeCalled();
  });
});

describe('Component|Download Button|Electricity', () => {
  let wrapper;

  test('should call saveAs', async () => {
    const dom = mount(getDownloadComponent({ page: 'electricity', view: 'region', sources: ['ALL'], mainSelection: 'electricityGeneration' }));
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve));
      dom.update();
      wrapper = getRendered(DownloadButton, dom);
    });

    const downloadButton = wrapper.find(Button);
    downloadButton.simulate('click');
    expect(saveAs).toBeCalled();
  });
});

describe('Component|DownloadButton|Oil-and-Gas', () => {
  let wrapper;

  test('should call saveAs', async () => {
    const dom = mount(getDownloadComponent({ page: 'oil-and-gas', mainSelection: 'oilProduction', view: 'region' }));
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve));
      dom.update();
      wrapper = getRendered(DownloadButton, dom);
    });

    const downloadButton = wrapper.find(Button);
    downloadButton.simulate('click');
    expect(saveAs).toBeCalled();
  });
});
