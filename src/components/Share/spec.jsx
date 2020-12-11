import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Button } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import { saveAs } from 'file-saver';
import Snackbar from '@material-ui/core/Snackbar';
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

  //

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
    const linkedInButton = wrapper.find(Button).at(1);
    const faceBookButton = wrapper.find(Button).at(2);
    const twitterButton = wrapper.find(Button).at(3);
    // const emailButton = wrapper.find(Button).at(4);

    linkedInButton.simulate('click');
    faceBookButton.simulate('click');
    twitterButton.simulate('click');
    // emailButton.simulate('click');

    await new Promise(resolve => setTimeout(resolve, 10)); // FIXME:

    expect(global.window.open).toHaveBeenCalledTimes(3);
  });

  test('should open copy link snack bar', () => {
    const linkButton = wrapper.find(Button).at(0);

    act(() => {
      linkButton.simulate('click');
      const snackBar = wrapper.find(Snackbar);
      expect(snackBar.exists()).not.toBeNull();
    });
  });
});

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

  //

  test('should render component', () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  test('should render text', () => {
    const button = wrapper.find(Button);

    expect(button.length).toBe(1);
    expect(button.text()).toBe('Download Data');
  });

  test('should be clickable', () => {
    const downloadButton = wrapper.find(Button);
    downloadButton.simulate('click');
    expect(saveAs).toBeCalled();
  });
});

describe('Component| Download Button | By-Sector', () => {
  let wrapper;

  test('should be clickable', async () => {
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

  test('should be clickable', async () => {
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

  test('should be clickable', async () => {
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

  test('should be clickable', async () => {
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
