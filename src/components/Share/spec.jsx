/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-properties */
import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Button, Dialog } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import { saveAs } from 'file-saver';
import { Share, DownloadButton } from '.';
import { TestContainer, getRendered } from '../../tests/utilities';
import { IconTwitter, IconFacebook, IconLinkedIn } from '../../icons';

const DEFAULT_CONFIG = {
  mainSelection: 'energyDemand',
  yearId: '2020',
  provinces: ['AB'],
  scenarios: ['Evolving'],
  view: 'region',
  unit: 'petajoules',
  provinceOrder: [
    'YT',
    'SK',
    'QC',
    'PE',
    'ON',
    'NU',
    'NT',
    'NS',
    'NL',
    'NB',
    'MB',
    'BC',
    'AB',
  ],
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
describe('Component| Share Buttons', () => {
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
    expect(wrapper.find(IconTwitter)).not.toBeNull();
    expect(wrapper.find(IconFacebook)).not.toBeNull();
    expect(wrapper.find(IconLinkedIn)).not.toBeNull();
    expect(wrapper.find(IconTwitter)).not.toBeNull();
    expect(wrapper.find(EmailIcon)).not.toBeNull();
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
    // These buttons have no good identifiers to grab them by
    const buttons = wrapper.find(Button);
    const linkedInButton = buttons.at(1);
    const faceBookButton = buttons.at(2);
    const twitterButton = buttons.at(3);
    const emailButton = buttons.at(4);

    // linkedInButton.simulate('click');
    // faceBookButton.simulate('click');
    // twitterButton.simulate('click');
    // emailButton.simulate('click');

    // expect(global.window.open).toHaveBeenCalledTimes(3);
    // expect(global.window.location.href).not.toBe('http://localhost/');

    await act(
      async () => {
        await linkedInButton.simulate('click');
        faceBookButton.simulate('click');
        twitterButton.simulate('click');
        emailButton.simulate('click');
        // FIXME: The fetch in these buttons takes an indeterminate amount of time.
        // A workaround has not yet been found
        await new Promise(resolve => setTimeout(resolve, 100));
        wrapper.update();

        // social media buttons open a pop up window
        // expect(global.window.open).toHaveBeenCalledTimes(1);
      },
    );
    expect(global.window.open).toHaveBeenCalledTimes(3);
    expect(global.window.location.href).not.toBe('http://localhost/');
    // await act(
    //   async () => {
    //     await faceBookButton.simulate('click');
    //     await new Promise(resolve => setTimeout(resolve, 100));
    //     wrapper.update();
    //     expect(global.window.open).toHaveBeenCalledTimes(2);
    //   },
    // );
    // await act(
    //   async () => {
    //     await twitterButton.simulate('click');
    //     await new Promise(resolve => setTimeout(resolve, 100));
    //     wrapper.update();
    //     expect(global.window.open).toHaveBeenCalledTimes(3);
    //   },
    // );

    // await act(
    //   async () => {
    //     await emailButton.simulate('click');
    //     await new Promise(resolve => setTimeout(resolve, 100));
    //     wrapper.update();
    //     // email redirects the href
    //     expect(global.window.location.href).not.toBe('http://localhost/');
    //   },
    // );
  });
});

describe('Component| Share | Copy Button', () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = mount(getShareComponent({ page: 'by-region' }));
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve));
      wrapper.update();
      navigator.__defineGetter__('userAgent', () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'); // FIXME: this is pretty hacky
    });
  });

  test('clicking button does not error with safari', async () => {
    const fakeUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A';
    navigator.__defineGetter__('userAgent', () => fakeUserAgent); // FIXME: this is pretty hacky
    // const button = wrapper.find(Button).at(0);

    // expect(wrapper.find(Dialog).prop('open')).toBe(false);
    await act(
      async () => {
        wrapper.find(Button).at(0).simulate('click');
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      },
    );
    // expect(wrapper.find(Dialog).prop('open')).toBe(true);
  });

  test('clicking button does not error with chrome', async () => {
    await act(
      async () => {
        await wrapper.find(Button).at(0).simulate('click');
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
      },
    );
  });
});
// #endregion
// #region Download Button
describe('Component| Download Button | By-Region', () => {
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

describe('Component| Download Button | By-Sector', () => {
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

describe('Component| Download Button | Scenarios', () => {
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

describe('Component| Download Button | Electricity', () => {
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

describe('Component| Download Button | Oil-and-gas', () => {
  let wrapper;

  test('should call saveAs', async () => {
    const dom = mount(getDownloadComponent({ page: 'oil-and-gas', mainSelection: 'oilProduction', view: 'source', sources: ['ISB'], sourceOrder: ['ISB'] }));
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

