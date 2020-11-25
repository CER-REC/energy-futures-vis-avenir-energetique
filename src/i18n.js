import enLang from './languages/english.json';
import frLang from './languages/french.json';

const flatten = (toFlatten) => {
  const flattened = {};
  const step = (obj, prevPath = '') => Object.entries(obj).forEach(([key, val]) => {
    const path = prevPath ? `${prevPath}.${key}` : key;
    if (typeof val === 'object') {
      step(val, path);
      return;
    }
    flattened[path] = val;
  });
  step(toFlatten);
  return flattened;
};

export default {
  en: flatten(enLang),
  fr: flatten(frLang),
};
