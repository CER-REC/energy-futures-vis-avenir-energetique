import Cookies from 'js-cookie';
import { v1 } from 'uuid';

class Analytics {
  constructor () {
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

  report ({ category, action, label, value, subVisualization }) {
    if (!category || !action) {
      console.warn('Missing analytics category or action');
      return;
    }

    this.dataLayer && this.dataLayer.push({
      event: 'energy future 2.0 interaction',
      category,
      action,
      userID: this.userId,
      visualization: 'energy future',
      // subVisualization,
      label,
      value,
    });
  }
}

export default new Analytics();
