import React from 'react';
import nock from 'nock';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Button } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import { saveAs } from 'file-saver';

import { Share, DownloadButton } from '.';
import { TestContainer, getRendered } from '../../tests/utilities';
import { IconTwitter, IconFacebook, IconLinkedIn } from '../../icons';

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

const getShareComponent = (props, options = {}) => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
    <Share {...options} />
  </TestContainer>
);

const getDownloadComponent = (props, options = {}) => (
  <TestContainer mockConfig={{ ...DEFAULT_CONFIG, ...props }}>
    <DownloadButton {...options} />
  </TestContainer>
);
// #region Share Buttons
describe('Component|ShareButtons', () => {
  let wrapper;

  beforeEach(async () => {
    const dom = mount(getShareComponent({ page: 'by-region' }));
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve));
      dom.update();
      wrapper = getRendered(Share, dom);
    });
  });

  test('should render component', () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  test('should render share buttons', () => {
    const buttons = wrapper.find(Button);
    expect(buttons.length).toBe(5);
    expect(wrapper.find(IconTwitter).exists()).toBeTruthy();
    expect(wrapper.find(IconFacebook).exists()).toBeTruthy();
    expect(wrapper.find(IconLinkedIn).exists()).toBeTruthy();
    expect(wrapper.find(IconTwitter).exists()).toBeTruthy();
    expect(wrapper.find(EmailIcon).exists()).toBeTruthy();
  });

  test('should open correct item', () => {
    // look for the 'help' icon button
    const iconButtons = wrapper.find(Button);
    expect(iconButtons.length).toBe(5);

    iconButtons.forEach((button) => {
      expect(button.prop('onClick')).not.toBeNull();
    });
  });

  test('should open social media links', async () => {
    const getMockPromise = () => {
      const bitlyDomain = 'http://localhost/bitlyService';
      const promise = new Promise((resolve) => {
        const scope = nock(bitlyDomain)
          .get(/.*/)
          .reply(200, {
            data: { url: 'https://bit.ly/2W6hHBG' },
          });
        // Timeout's needed to move the assertions to the end of the process queue
        scope.on('replied', () => setTimeout(resolve));
      });
      return promise;
    };

    // These buttons have no good identifiers to grab them by
    const buttons = wrapper.find(Button);
    const linkedInButton = buttons.at(1);
    const faceBookButton = buttons.at(2);
    const twitterButton = buttons.at(3);
    const emailButton = buttons.at(4);

    let mockPromise = getMockPromise();

    linkedInButton.simulate('click');
    await mockPromise;
    expect(global.window.open).toHaveBeenCalledTimes(1);

    faceBookButton.simulate('click');
    mockPromise = getMockPromise();

    await mockPromise;
    expect(global.window.open).toHaveBeenCalledTimes(2);

    twitterButton.simulate('click');
    mockPromise = getMockPromise();
    await mockPromise;

    expect(global.window.open).toHaveBeenCalledTimes(3);

    emailButton.simulate('click');
    mockPromise = getMockPromise();
    await mockPromise;

    // email redirects the href
    expect(global.window.location.href).not.toBe('http://localhost/');
  });
});

describe('Component|Share|CopyButton', () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = mount(getShareComponent({ page: 'by-region' }));
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve));
      wrapper.update();
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
        configurable: true,
      });
    });
  });

  test('clicking button does not error with safari', async () => {
    const fakeUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A';
    Object.defineProperty(navigator, 'userAgent', {
      value: fakeUserAgent,
      configurable: true,
    });

    await act(
      async () => {
        wrapper.find(Button).at(0).simulate('click');
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      },
    );
  });

  test('clicking button does not error with chrome', async () => {
    await act(
      async () => {
        wrapper.find(Button).at(0).simulate('click');
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      },
    );
  });
});
// #endregion
// #region Download Button
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
// #endregion

