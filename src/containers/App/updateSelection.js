import getTreeFromCondition from '../../queries/getTreeFromCondition';
import getTreeFromInstrument from '../../queries/getTreeFromInstrument';
import getTreeFromProject from '../../queries/getTreeFromProject';
import getTreeFromCompany from '../../queries/getTreeFromCompany';
import getTreeFromRegion from '../../queries/getTreeFromRegion';
import handleQueryError from '../../utilities/handleQueryError';
import randomArrayValue from '../../utilities/randomArrayValue';

const keepPrev = (selected, ...keys) => keys.reduce((acc, next) => {
  acc[next] = selected[next];
  return acc;
}, {});

const defaultSelection = {
  condition: 0,
  instrument: 0,
  region: 0,
  project: 0,
  company: 0,
};

const selectionPaths = {
  project: {
    query: getTreeFromProject,
    selection: (project, selected) => ({
      project: project.id,
      company: project.companyIds.includes(selected.company)
        ? selected.company
        : randomArrayValue(project.companyIds),
      ...(project.instruments.length === 0
        ? {}
        : {
          instrument: project.instruments[0].id,
          condition: project.instruments[0].conditions[0].id,
          // TODO: Confirm with Adam about original logic
          // This sets the key `0` to an array of regionIds?
          // [newSelection.Region] = project.instruments[0].regionIds;
          region: project.instruments[0].regionIds[0],
        }),
    }),
  },

  region: {
    query: getTreeFromRegion,
    selection: (region, selected) => {
      if (region.instruments.length === 0) { return { region: region.id }; }
      const selectedInstrumentInRegion = region.instruments
        .find(({ id }) => id === selected.instrument);
      // If the selected instrument is in this region, don't reset other values
      if (selectedInstrumentInRegion) {
        return {
          region: region.id,
          ...keepPrev(selected, 'condition', 'instrument', 'project', 'company'),
        };
      }

      // Select a random instrument, and the related condition/project/company
      const instrument = randomArrayValue(region.instruments);
      return {
        region: region.id,
        condition: instrument.conditions[0].id,
        instrument: instrument.id,
        project: instrument.project.id,
        company: randomArrayValue(instrument.project.companyIds),
      };
    },
  },

  company: {
    query: getTreeFromCompany,
    selection: (company, selected) => {
      if (!company.projects.length) { return { company: company.id }; }
      const selectedProjectInCompany = company.projects
        .find(({ id }) => id === selected.project);

      if (selectedProjectInCompany) {
        return {
          company: company.id,
          ...keepPrev(selected, 'project', 'instrument', 'condition', 'region'),
        };
      }

      const project = company.projects[0];
      if (!project.instruments.length) {
        return {
          company: company.id,
          project: project.id,
        };
      }

      return {
        company: company.id,
        project: project.id,
        instrument: project.instruments[0].id,
        condition: project.instruments[0].conditions[0].id,
        region: randomArrayValue(project.instruments[0].regionIds),
      };
    },
  },

  instrument: {
    query: getTreeFromInstrument,
    selection: (instrument, selected) => ({
      instrument: instrument.id,
      project: instrument.projectId,
      company: instrument.project.companyIds.includes(selected.company)
        ? selected.company
        : randomArrayValue(instrument.project.companyIds),
      region: instrument.regionIds.includes(selected.region)
        ? selected.region
        : randomArrayValue(instrument.regionIds),
    }),
  },

  condition: {
    query: getTreeFromCondition,
    selection: (condition, selected) => ({
      condition: condition.id,
      instrument: condition.instrumentId,
      project: condition.instrument.projectId,
      company: condition.instrument.project.companyIds.includes(selected.company)
        ? selected.company
        : randomArrayValue(condition.instrument.project.companyIds),
      region: condition.instrument.regionIds.includes(selected.region)
        ? selected.region
        : randomArrayValue(condition.instrument.regionIds),
    }),
  },
};

const execute = (prevSelection, setSelected, client, from, variables, staticSelection = {}) => {
  const executeWrapped = (fromWrapped, variablesWrapped, staticWrapped = {}) => execute(
    prevSelection,
    setSelected,
    client,
    fromWrapped,
    variablesWrapped,
    { ...staticSelection, ...staticWrapped },
  );
  const { query, selection } = selectionPaths[from];
  return client.query({ query, variables })
    .then((result) => {
      handleQueryError(result);
      // Strip off the name of the query, and just return the data
      const data = Object.values(result.data)[0];
      return Promise.resolve(selection(data, prevSelection, variables, executeWrapped))
        .then((nextSelection) => {
          if (!nextSelection) { return null; }
          const newSelection = { ...defaultSelection, ...nextSelection, ...staticSelection };
          setSelected(newSelection);

          return newSelection;
        });
    });
};

export default execute;
