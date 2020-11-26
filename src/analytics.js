import Cookies from 'js-cookie';
import { v1 } from 'uuid';

/* eslint-disable no-console */
class Analytics {
  constructor() {
    if (!window.dataLayer) {
      console.warn('Google Tag Manager dataLayer not found.');
      return;
    }
    this.dataLayer = window.dataLayer;

    this.userId = Cookies.get('energy-futures-UUID');
    if (!this.userId) {
      this.userId = v1();
      Cookies.set('energy-futures-UUID', this.userId);
    }
  }

  dataLayer = null;

  userId = null;

  getVisualization(page) { // eslint-disable-line class-methods-use-this
    switch (page) {
      case 'by-region': return 'by region';
      case 'by-sector': return 'by sector';
      case 'scenarios': return 'scenarios';
      case 'electricity': return 'electricity generation';
      case 'oil-and-gas': return 'oil and gas';
      case 'demand': return 'demand';
      default: return undefined;
    }
  }

  report(page, { category, action, label, value }, disableSubVisualization /* boolean */) {
    const subVisualization = this.getVisualization(page);
    if (!subVisualization) {
      console.warn('Incorrect page');
      return;
    }

    if (!category || !action) {
      console.warn('Missing analytics category or action');
      return;
    }

    const event = {
      event: 'energy future interaction',
      category,
      action,
      userID: this.userId,
      visualization: 'energy future',
      subVisualization: disableSubVisualization ? 'none' : subVisualization,
      ...(label ? { label } : {}),
      ...(value ? { value } : {}),
    };

    if (this.dataLayer) {
      console.log('Sending event:', event);
      this.dataLayer.push(event);
    }
  }

  reportLanding(page) {
    this.report(page, { category: 'menu', action: 'click', label: 'visualization', value: page }, true);
  }

  reportNav(page) {
    this.report(page, { category: 'menu', action: 'click', label: 'visualization', value: page });
  }

  reportMisc(page, action, value) {
    this.report(page, { category: 'menu', action, label: 'misc', value });
  }

  reportFeature(page, label, value) {
    this.report(page, { category: 'feature', action: 'click', label, value });
  }

  reportMedia(page, action) {
    this.report(page, { category: 'media', action /* 'pause' or 'play' */ });
  }

  reportHelp(page, label) {
    this.report(page, { category: 'help', action: 'click', label });
  }

  reportPoi(page, value) {
    this.report(page, { category: 'graph poi', action: 'click', value });
  }
}

export default new Analytics();
