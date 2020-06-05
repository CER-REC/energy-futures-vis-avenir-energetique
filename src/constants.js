export const applicationPath = {
  en: 'energy-future',
  fr: 'energy-future-projet',
};

export const lang = (typeof document !== 'undefined'
    && document.location
    && document.location.href
    && document.location.href.includes(applicationPath.fr))
  || (process.env.NODE_ENV === 'development'
    && typeof window !== 'undefined'
    && window.localStorage
    && window.localStorage.getItem('dev-lang') === 'fr')
  ? 'fr' : 'en';

export const features = {
  instrument: {
    0: 'rgb(122, 25, 17)',
    1: 'rgb(239, 71, 57)',
    2: 'rgb(73, 127, 57)',
    3: 'rgb(246, 155, 202)',
    4: 'rgb(231, 157, 78)',
    5: 'rgb(141, 191, 105)',
    6: 'rgb(221, 106, 97)',
    7: 'rgb(175, 107, 68)',
    8: 'rgb(90, 158, 150)',
    9: 'rgb(96, 96, 96)',
  },
  theme: {
    ADMINISTRATIVE: 'rgb(201, 215, 65)',
    DAMAGE_PREVENTION: 'rgb(133, 28, 133)',
    EMERGENCY_MANAGEMENT: 'rgb(11, 121, 153)',
    ENFORCEMENT: 'rgb(74, 166, 255)',
    ENVIRONMENTAL_PROTECTION: 'rgb(33, 181, 115)',
    FINANCIAL: 'rgb(247, 193, 97)',
    INTEGRITY_MANAGEMENT: 'rgb(153, 82, 255)',
    MANAGEMENT_SYSTEM: 'rgb(36, 91, 64)',
    SAFETY_MANAGEMENT: 'rgb(68, 34, 149)',
    SECURITY: 'rgb(221, 10, 10)',
    SOCIO_ECONOMIC: 'rgb(153, 153, 255)',
    STANDARD_CONDITION: 'rgb(181, 11, 128)',
    SUNSET_CLAUSE: 'rgb(41, 41, 218)',
  },
  phase: {
    ABANDONMENT: 'rgb(102, 102, 102)',
    DURING_CONSTRUCTION_PHASE: 'rgb(83, 164, 248)',
    EXPIRY_DATE_OF_REG_INSTR: 'rgb(175, 244, 244)',
    INCLUDES_ALL_PHASES_OF_CONSTR: 'rgb(72, 82, 193)',
    NOT_CONSTRUCTION_RELATED: 'rgb(5, 215, 210)',
    POST_CONSTRUCTION_PHASE: 'rgb(31, 51, 79)',
    PRIOR_TO_THE_CONSTRUCTION_PHASE: 'rgb(210, 102, 236)',
    UNSPECIFIED: 'rgb(26, 57, 146)',
  },
  filing: {
    REQUIRED: 'rgb(82, 82, 247)',
    NOT_REQUIRED: 'rgb(58, 58, 58)',
  },
  type: {
    NON_STANDARD: 'rgb(77, 39, 90)',
    STANDARD: 'rgb(181, 11, 128)',
  },
  status: {
    IN_PROGRESS: 'rgb(101, 216, 126)',
    CLOSED: 'rgb(137, 137, 137)',
  },
};

export const noRegionColor = 'rgb(153,153,153)';
export const pdfLink = (lang === 'en')
  ? 'http://www.cer-rec.gc.ca/dv/conditions/conditions-data-methodology.pdf'
  : 'http://www.cer-rec.gc.ca/dv/conditions/conditions-donnees-methodologie.pdf';
export const nltkLink = 'http://www.nltk.org/';
export const regDocsUrl = (lang === 'en')
  ? 'https://apps.cer-rec.gc.ca/REGDOCS/Search?txthl='
  : 'https://apps.cer-rec.gc.ca/REGDOCS/Recherche/Index/?txthl=';

export const featureDescriptionLinks = (lang === 'en')
  ? {
    phase: 'https://www.cer-rec.gc.ca/bts/nws/vds/thlfcclapprch-eng.html',
    instrument: 'https://open.canada.ca/data/dataset/5b137b2a-d196-44ca-96fe-e9e33f847594',
  }
  : {
    phase: 'https://www.cer-rec.gc.ca/bts/nws/vds/thlfcclapprch-fra.html',
    instrument: 'https://ouvert.canada.ca/data/fr/dataset/5b137b2a-d196-44ca-96fe-e9e33f847594',
  };

export const localDataURL = (lang === 'en')
  ? 'http://www.cer-rec.gc.ca/open/conditions/conditions.csv'
  : 'http://www.cer-rec.gc.ca/ouvert/conditions/conditions.csv';

export const contactEmail = (lang === 'en')
  ? 'energyindesign@cer-rec.gc.ca'
  : 'conceptionenergie@rec-cer.gc.ca';

export const fileDownloadName = localDataURL.substring(localDataURL.lastIndexOf('/') + 1, localDataURL.length);
export const guideSize = 128;

export const provinces = {
  YT: 'Yukon',
  NT: 'Northwest Territories',
  NU: 'Nunavut',
  NL: 'Newfoundland and Labrador',
  PE: 'Prince Edward Island',
  BC: 'British Columbia',
  AB: 'Alberta',
  SK: 'Saskatchewan',
  MB: 'Manitoba',
  ON: 'Ontario',
  QC: 'Québec',
  NB: 'New Brunswick',
  NS: 'Nova Scotia',
};

export const transitionStates = {
  view1: 0,
  tutorialStart: 1,
  view2: 8,
  view1Reset: 9,
  view3: 10,
};

export const shareUrls = {
  facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
  linkedin: 'https://www.linkedin.com/shareArticle?mini=true&url=',
  twitter: 'https://twitter.com/intent/tweet?url=',
};
