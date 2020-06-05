import PropTypes from 'prop-types';
import { isValidElementType } from 'react-is';
import { features } from './constants';

export const featureTypes = PropTypes.oneOf(Object.keys(features));

const aggregatedFeatureEntry = PropTypes.arrayOf(PropTypes.shape({
  name: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
})).isRequired;

export const aggregatedFeatureData = PropTypes.shape({
  instrument: aggregatedFeatureEntry,
  theme: aggregatedFeatureEntry,
  phase: aggregatedFeatureEntry,
  status: aggregatedFeatureEntry,
  type: aggregatedFeatureEntry,
  filing: aggregatedFeatureEntry,
});

export const company = PropTypes.shape({
  primary: PropTypes.string.isRequired,
  secondary: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
});

export const project = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  shortName: PropTypes.string.isRequired,
  numberOfConditions: PropTypes.number.isRequired,
  numberOfInstruments: PropTypes.number.isRequired,
  aggregatedCount: aggregatedFeatureData.isRequired,
});

export const conditionsPerYear = PropTypes.shape({
  year: PropTypes.number.isRequired,
  aggregatedCount: aggregatedFeatureData.isRequired,
});

export const allConditionsPerYearType = PropTypes.shape({
  minYear: PropTypes.number.isRequired,
  maxYear: PropTypes.number.isRequired,
  years: PropTypes.arrayOf(conditionsPerYear).isRequired,
});

export const displayOrder = PropTypes.shape({
  filing: PropTypes.arrayOf(PropTypes.string).isRequired,
  phase: PropTypes.arrayOf(PropTypes.string).isRequired,
  status: PropTypes.arrayOf(PropTypes.string).isRequired,
  type: PropTypes.arrayOf(PropTypes.string).isRequired,
  theme: PropTypes.arrayOf(PropTypes.string).isRequired,
  instrument: PropTypes.arrayOf(PropTypes.string).isRequired,
  instrumentOther: PropTypes.arrayOf(PropTypes.string).isRequired,
});

export const allConfigurationDataType = PropTypes.shape({
  displayOrder: displayOrder.isRequired,
  instrumentYearRange: PropTypes.shape({
    max: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
  }).isRequired,
  lastUpdated: PropTypes.string.isRequired,
});

export const browseByType = PropTypes.oneOf(['company', 'location']);

export const allCompanyData = PropTypes.arrayOf(
  company,
);

export const yearRangeType = PropTypes.shape({
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
});

export const suggestedKeywordsObject = PropTypes.objectOf(
  PropTypes.shape({
    conditions: PropTypes.number.isRequired,
    category: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
);

export const conditionData = PropTypes.arrayOf(PropTypes.shape({
  instrumentNumber: PropTypes.string.isRequired,
  issuanceDate: PropTypes.string.isRequired,
  effectiveDate: PropTypes.string,
  sunsetDate: PropTypes.string,
  status: PropTypes.string.isRequired,
  location: PropTypes.array.isRequired,
  conditions: PropTypes.arrayOf(PropTypes.shape({
    binnedValue: PropTypes.number.isRequired,
    fill: PropTypes.arrayOf(PropTypes.string).isRequired,
    keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
    text: PropTypes.string.isRequired,
    details: PropTypes.shape({
      theme: PropTypes.array.isRequired,
      phase: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      filing: PropTypes.string.isRequired,
    }).isRequired,
    conditionNumber: PropTypes.string.isRequired, // Despite the name, this is a string
  })).isRequired,
}));

export const viewTwo = {
  layoutOnly: PropTypes.bool,
  browseBy: browseByType.isRequired,
  wheelData: PropTypes.arrayOf(PropTypes.any),
  regionCompanyData: PropTypes.shape({
    companies: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })),
    selectedConditionCompanies: PropTypes.arrayOf(
      PropTypes.number,
    ),
  }),
  selectedAggregatedCount: aggregatedFeatureData,
  selected: PropTypes.shape({
    company: PropTypes.number,
    region: PropTypes.number,
    project: PropTypes.number,
    feature: featureTypes.isRequired,
  }).isRequired,
  projectMenuLoading: PropTypes.bool,
  projectsData: PropTypes.arrayOf(project),
  projectYear: yearRangeType.isRequired,
  included: PropTypes.arrayOf(PropTypes.string).isRequired,
  excluded: PropTypes.arrayOf(PropTypes.string).isRequired,
  projectStatus: PropTypes.arrayOf(PropTypes.string).isRequired,
  findAny: PropTypes.bool.isRequired,
  setFindAny: PropTypes.func.isRequired,
  setProjectYear: PropTypes.func.isRequired,
  setProjectStatus: PropTypes.func.isRequired,
  setIncluded: PropTypes.func.isRequired,
  setExcluded: PropTypes.func.isRequired,
  setSelectedFeature: PropTypes.func.isRequired,
  setSelectedProject: PropTypes.func.isRequired,
  setSelectedCompany: PropTypes.func.isRequired,
  setSelectedRegion: PropTypes.func.isRequired,
  jumpToView1: PropTypes.func.isRequired,
  jumpToView3: PropTypes.func.isRequired,
  projectYears: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number,
  }),
  searchResults: PropTypes.shape({
    companyIdLookup: PropTypes.objectOf(PropTypes.bool),
    conditionIdLookup: PropTypes.objectOf(PropTypes.bool),
    projectIdLookup: PropTypes.objectOf(PropTypes.bool),
    regionIdLookup: PropTypes.objectOf(PropTypes.bool),
  }),
  filteredProjectLookup: PropTypes.objectOf(PropTypes.bool),
  displayOrder: displayOrder.isRequired,
  availableCategories: PropTypes.arrayOf(PropTypes.string),
  suggestedKeywords: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    category: PropTypes.arrayOf(PropTypes.string),
    conditionCount: PropTypes.number,
  })).isRequired,
  allConditionsPerYear: allConditionsPerYearType.isRequired,
  updateSearch: PropTypes.func.isRequired,
  openNumberDetails: PropTypes.func,
};
// Used in Keyword List (SuggestedKeywords)
// Example: [ ["safety", { conditions: 1200, category: ['category1', 'category2']}],
// ["emissions", { conditions: 400, category: ['category2', 'category3]}]]

export const suggestedKeywordsArrayType = PropTypes
  .arrayOf((props, propName, componentName, _, propFullName) => {
    const value = props[propName];
    if (!Array.isArray(value) || value.length !== 2) {
      return new Error(
        `Invalid prop \`${propFullName}\` supplied to \`${componentName}\`. Expected keyword tuple.`,
      );
    }
    if (typeof value[0] !== 'string') {
      return new Error(
        `Invalid prop \`${propFullName}[0]\` supplied to \`${componentName}\`. Expected keyword tuple.`,
      );
    }
    return PropTypes.checkPropTypes({
      conditions: PropTypes.number.isRequired,
      category: PropTypes.arrayOf(PropTypes.string).isRequired,
    }, value[1], `${propFullName}[1]`, componentName);
  });

export const nullableNumber = (props, propName, componentName) => {
  if (typeof props[propName] === 'undefined') { return undefined; }
  return nullableNumber.isRequired(props, propName, componentName);
};

nullableNumber.isRequired = (props, propName, componentName) => {
  if (props[propName] === null || typeof props[propName] === 'number') { return undefined; }
  return new Error(
    `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Validation failed.`,
  );
};

// "is a component" check borrowed from React Router:
// https://github.com/ReactTraining/react-router/blob/6a99c9362d46f768d93bbf9b9bc657ca7ce683be/packages/react-router/modules/Route.js#L82
export const componentType = (props, propName, componentName) => {
  if (props[propName] === undefined) { return null; }
  return componentType.isRequired(props, propName, componentName);
};

componentType.isRequired = (props, propName, componentName) => {
  if (!props[propName]) {
    return new Error(
      `Invalid prop \`${propName}\` supplied to \`${componentName}\`. \`${propName}\` is marked as required.`,
    );
  }

  if (!isValidElementType(props[propName])) {
    return new Error(
      `Invalid prop \`${propName}\` supplied to \`${componentName}\`. \`${propName}\` expected a React component.`,
    );
  }

  return null;
};
