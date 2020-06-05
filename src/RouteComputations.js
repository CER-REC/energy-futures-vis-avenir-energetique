import { applicationPath } from './constants';

const RouteComputations = {
  bitlyParameter(language) {
    return `${document.location.origin}/${applicationPath[language]}/${encodeURIComponent(document.location.search)}`;
  },
  bitlyEndpoint() {
    return `${document.location.origin}/bitlyService/api/bitlyShortlink`;
  },
};
export default RouteComputations;
