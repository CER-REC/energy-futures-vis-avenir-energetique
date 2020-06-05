# GraphQL

We will be making use of GraphQL to easily query data from the server. This will
be implemented in C# in the ASP.Net application running on the CER infrastructure.

## Scalar Types

* Date, DateTime, Time - [graphql-iso-date](https://www.npmjs.com/package/graphql-iso-date)

## Enums

```gql
enum ProjectStatus {
  COMPLETED
  IN_PROGRESS
  CANCELLED
  DRAFT
}

enum InstrumentStatus {
  ALL_CONDITIONS_MET
  DRAFT
  EXPIRED
  IN_PROGRESS
  REVOKED
}

enum ConditionStatus {
  IN_PROGRESS
  CLOSED
}

enum ConditionFlag {
  DIFFICULT_TO_TRACK
  MORE_CLARIFICATION_REQUIRED
  NO_DATE_SPECIFIED
  POORLY_WRITTEN
  UNCLEAR_OR_NO_END_DATE
}

enum ConditionPhase {
  ABANDONMENT
  DURING_CONSTRUCTION_PHASE
  EXPIRY_DATE_OF_REG_INSTR
  INCLUDES_ALL_PHASES_OF_CONSTR
  NOT_CONSTRUCTION_RELATED
  POST_CONSTRUCTION_PHASE
  PRIOR_TO_CONSTRUCTION_PHASE
  UNSPECIFIED
}

enum ConditionTheme {
  ADMINISTRATIVE
  DAMAGE_PREVENTION
  EMERGENCY_MANAGEMENT
  ENFORCEMENT
  ENVIRONMENTAL_PROTECTION
  FINANCIAL
  INTEGRITY_MANAGEMENT
  MANAGEMENT_SYSTEM
  SAFETY_MANAGEMENT
  SECURITY
  SOCIO_ECONOMIC
  STANDARD_CONDITION
  SUNSET_CLAUSE
}

enum ConditionSubtheme {
  ENVIRONMENTAL_PROTECTION_PLAN
  FINANCIAL
  PIPELINE
  POST_CONSTRUCTION_REPORT
  REGULATORY_REPORTING
  WILDLIFE
}

enum KeywordType {
  GENERIC
  SPECIFIC
  LOCATION
  INDIGENOUS_COMMUNITY
}
```

## Types

### Project

```gql
type {
  Project {
    id: ID!
    nameEnglish: String!
    nameFrench: String!
    companies: [Company!]!
    instruments: [Instrument!]!
    status: ProjectStatus!
  }
}
```

### Company

```gql
type {
  Company {
    id: ID!
    name: String!
    projects: [Project!]!
  }
}
```

### Instruments

```gql
type {
  Instrument {
    id: ID!
    instrumentNumber: String!
    project: Project!
    activityName: String!
    status: InstrumentStatus!
    dateEffective: Date!
    dateIssuance: Date!
    dateSunset: Date!
    regDocs: [RegDoc!]!
    conditions: [Condition!]!
  }
}
```

### Conditions

```gql
type {
  Condition {
    id: ID!
    textEnglish: String!
    textFrench: String!
    status: ConditionStatus!
    statusDate: Date
    latestFilingDate: Date
    flag: ConditionFlag
    justificationEnglish: String!
    phase: ConditionPhase
    instrumentNumber: String!
    standardCondition: Boolean!
    theme: [ConditionTheme!]! # May be an empty array
    subtheme: ConditionSubtheme
    desiredEndResult: String
    filingRequired: Boolean!
    instruments: Instrument!
    keywords: [Keyword!]!
  }
}
```

### Keywords

```gql
type {
  Keyword {
    name: String!
    type: KeywordType!
  }
}
```

### Reg Docs

```gql
type {
  RegDoc {
    id: ID!
    name: String!
    instruments: [Instrument!]!
  }
}
```

## InputTypes

### ConditionFilter

```gql
input ConditionFilter {
  projectID: ID
  location: String
}
```

### CompanyFilter

```gql
input CompanyFilter {
  location: String
}
```

## Queries

All of the queries should be designed to reduce the amount of data required at
the first load, while not re-querying for the same data between separate
components/queries. To simplify this, all queries will be run from the Views,
and passed to the Components as props.

### View 1 Random Conditions - getRandomConditions(count: Int!)

```gql
query {
  getRandomConditions(count: 100) {
    conditions {
      id
      keywords {
        name
        type
      }
      instrument {
        project {
          id
          companies { id }
        }
      }
    }
  }
}
```

### View 2 Keyword Autofill - getAllKeywords

```gql
query {
  getAllKeywords {
    keywords {
      name
      type
    }
  }
}
```

### View 2 Company Wheel - getAllCompanies

```gql
query {
  getAllCompanies {
    companies {
      id
      name
      projects {
        id
      }
    }
  }
}
```

### Highlighted Conditions and Projects - getHighlighted

```gql
query {
  getHighlighted(keywords: [Keyword!]!) {
    conditionIDs: [ID!]!
    projectIDs: [ID!]!
  }
}
```

### View 2 Project Menu - getCompanyProjects

```gql
query {
  getCompanyProjects(companyID: ID!) {
    projects: [Projects!]!
  }
}
```

### View 2 Condition Details - getAllConditions(filter: ConditionFilter)

TODO: Determine whether we should be fetching the conditions, or the instruments
with their conditions. How do we want to handle rendering?

```gql
query {
  getAllConditions(filter: { projectID: "1234" }) {
    conditions: [Condition!]!
  }
}
```

### View 2 Companies in Selected Location - getAllCompanies(filter: CompanyFilter)

```gql
query {
  getAllCompanies(filter: { location: "Medicine Hat Region" }) {
    companies: [Company!]!
  }
}
```
