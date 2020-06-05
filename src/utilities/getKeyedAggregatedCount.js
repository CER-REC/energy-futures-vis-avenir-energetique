import memoize from 'lodash.memoize';
import memoizeReference from './memoizeReference';

export default memoize(
  (aggregatedCounts, feature) => aggregatedCounts[feature]
    .reduce((acc, { name, count }) => ({ ...acc, [name]: count }), {}),
  (count, feature) => `${memoizeReference(count)}-${feature}`,
);
