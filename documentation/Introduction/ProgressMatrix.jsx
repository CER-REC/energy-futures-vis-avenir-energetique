import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const PENDING = 0;
const STARTED = 1;
const HALFWAY = 2;
const MOSTLY = 3;
const FINISHED = 4;

const classMapping = {
  [PENDING]: 'pending',
  [STARTED]: 'started',
  [HALFWAY]: 'halfway',
  [MOSTLY]: 'mostly',
  [FINISHED]: 'finished',
};

const getClass = stage => classMapping[stage];

// [Functionality, Data, Design]
const components = {
  BarContainer: [FINISHED, FINISHED, MOSTLY],
  BrowseByBtn: [FINISHED, FINISHED, MOSTLY],
  BubbleChart: [MOSTLY, HALFWAY, HALFWAY],
  ChartIndicator: [FINISHED, FINISHED, MOSTLY],
  CircleContainer: [FINISHED, FINISHED, FINISHED],
  ConditionDetails: [MOSTLY, HALFWAY, MOSTLY],
  ConditionExplorer: [STARTED, HALFWAY, STARTED],
  Dropdown: [FINISHED, FINISHED, FINISHED],
  FeatureDescription: [MOSTLY, MOSTLY, MOSTLY],
  FeatureFlag: [FINISHED, MOSTLY, FINISHED],
  FeatureTypesDescription: [MOSTLY, MOSTLY, MOSTLY],
  FeaturesLegend: [FINISHED, MOSTLY, MOSTLY],
  FeaturesMenu: [FINISHED, MOSTLY, MOSTLY],
  Icon: [FINISHED, FINISHED, FINISHED],
  InstrumentsLegend: [MOSTLY, HALFWAY, MOSTLY],
  List: [FINISHED, FINISHED, FINISHED],
  LocationWheelMinimap: [FINISHED, MOSTLY, MOSTLY],
  MainInfoBar: [HALFWAY, HALFWAY, HALFWAY],
  Modal: [HALFWAY, HALFWAY, HALFWAY],
  ProjectMenu: [MOSTLY, MOSTLY, HALFWAY],
  RegionCompanies: [MOSTLY, MOSTLY, MOSTLY],
  SearchBar: [FINISHED, MOSTLY, MOSTLY],
  SelectedGroupBar: [FINISHED, FINISHED, MOSTLY],
  ShareIcon: [MOSTLY, FINISHED, MOSTLY],
  ShortcutInfoBar: [MOSTLY, MOSTLY, MOSTLY],
  SmallMultiplesLegend: [FINISHED, MOSTLY, MOSTLY],
  StreamGraph: [FINISHED, MOSTLY, MOSTLY],
  TrendButton: [FINISHED, HALFWAY, HALFWAY],
  Wheel: [HALFWAY, HALFWAY, HALFWAY],
};

// [Components Implemented, Interaction, Data, Design]
const views = {
  ViewOne: [MOSTLY, MOSTLY, HALFWAY, MOSTLY],
  ViewTwo: [FINISHED, MOSTLY, HALFWAY, HALFWAY],
  ViewThree: [MOSTLY, MOSTLY, HALFWAY, MOSTLY],
  Footer: [HALFWAY, MOSTLY, MOSTLY, HALFWAY],
};

// [Architecture, Functionality, Deployment, Refinement]
const backends = {
  ETL: [MOSTLY, MOSTLY, HALFWAY, HALFWAY],
  'DVI Webservice': [MOSTLY, MOSTLY, STARTED, STARTED],
  'Conditions Webservice': [MOSTLY, MOSTLY, HALFWAY, HALFWAY],
  'GraphQL Data API': [HALFWAY, STARTED, STARTED, PENDING],
};

const getAverage = (input) => {
  const values = Object.values(input);
  const columns = values[0].length;
  return values
    .reduce(
      (acc, next) => acc.map((v, i) => (v + next[i])),
      Array(columns).fill(0),
    )
    .map(v => Math.round(v / values.length));
};

const ColorTable = ({ title, headers, data, className }) => (
  <div className={`ColorTable ${className}`}>
    <h2>{title}</h2>
    <table cellPadding="4" cellSpacing="0">
      <thead>
        <tr>
          <th>Name</th>
          {headers.map(v => <th key={v}>{v}</th>)}
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([name, stage]) => (
          <tr key={name}>
            <td>{name}</td>
            {stage.map((v, i) => <td key={headers[i]} className={getClass(v)}>&nbsp;</td>)}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td>Average</td>
          {getAverage(data).map((v, i) => <td key={headers[i]} className={getClass(v)}>&nbsp;</td>)}
        </tr>
      </tfoot>
    </table>
  </div>
);

ColorTable.propTypes = {
  title: PropTypes.string.isRequired,
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  className: PropTypes.string,
};

ColorTable.defaultProps = {
  className: '',
};

export default () => (
  <div className="ProgressMatrix">
    <h1>Progress Matrix</h1>

    <ColorTable
      title="Color Scale"
      headers={['Pending', 'Started', 'Half Way', 'Mostly Complete', 'Finished']}
      data={{ key: [0, 1, 2, 3, 4] }}
      className="key"
    />

    <div className="column">
      <ColorTable
        title="Components"
        headers={['Functionality', 'Data Connection', 'Design']}
        data={components}
      />
    </div>

    <div className="column">
      <ColorTable
        title="Views"
        headers={['Components Implemented', 'Interaction', 'Data Connection', 'Design']}
        data={views}
      />

      <ColorTable
        title="Backends"
        headers={['Architecture', 'Functionality', 'Deployment', 'Refinement']}
        data={backends}
      />
    </div>
  </div>
);
