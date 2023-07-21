import Cookies from 'js-cookie';
import { v1 } from 'uuid';
import { lang } from './constants';

/* eslint-disable no-console */
class Analytics {
  constructor() {
    if (!window.dataLayer) {
      console.warn('Google Tag Manager dataLayer not found.');
    }

    this.dataLayer = window.dataLayer || [];
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
      case 'landing': return 'landing';
      case 'by-region': return 'by region';
      case 'by-sector': return 'by sector';
      case 'scenarios': return 'scenarios';
      case 'electricity': return 'electricity generation';
      case 'oil-and-gas': return 'oil and gas';
      case 'demand': return 'demand';
      case 'emissions': return 'emissions';
      default: return undefined;
    }
  }

  report(page, category, action, value, data) {
    if (!category || !action) {
      console.warn('Missing analytics category or action');
      return;
    }

    const event = {
      event: 'visualization event',
      event_visualization: 'energy future interaction',
      event_subvisualization: this.getVisualization(page),
      event_category: category,
      event_action: action,
      event_value: value,
      event_language: lang,
      event_userID: this.userId,
      // Declared undefined values will not be sent to GA
      event_label: undefined,
      event_path: undefined,
      event_count: undefined,
      event_doccount: undefined,
      event_hittimestamp: undefined,
      event_hitcount: undefined,
      ...(data || {}),
    };

    this.dataLayer.push(event);
  }

  reportLanding(value) {
    this.report(null, 'landing', 'click', this.getVisualization(value) || value);
  }

  reportNav(page, target) {
    this.report(page, 'menu', 'click', this.getVisualization(target));
  }

  reportFooter(page, action, value) {
    this.report(page, 'footer', action, value);
  }

  reportFeature(page, label, value) {
    this.report(page, 'feature', 'click', value, { event_label: label });
  }

  reportMedia(page, type) {
    this.report(page, 'media', 'click', type);
  }

  reportHelp(page, type, label) {
    this.report(page, 'help', 'click', type, { event_label: label });
  }
}

export default new Analytics();
