import { features } from '../constants';

export default (feature, subfeature, index) => (
  features[feature][feature === 'instrument' ? index : subfeature]
);
