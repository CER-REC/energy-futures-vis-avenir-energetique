// eslint-disable-next-line no-unused-vars
import { features } from '../constants';
import getKeyedAggregatedCount from './getKeyedAggregatedCount';
import getFeatureColor from './getFeatureColor';

// eslint-disable-next-line no-unused-vars
export default (instruments, selectedFeature, displayOrder) => (
  instruments.map((instrument) => {
    const {
      number,
      dateIssuance,
      dateEffective,
      dateSunset,
      status,
      regions,
      conditions,
      documentNumber,
    } = instrument;

    const formattedConditions = conditions.reduce((acc, condition) => {
      const counts = getKeyedAggregatedCount(condition.aggregatedCount, selectedFeature);
      const fill = displayOrder[selectedFeature]
        .reduce((fillAcc, next, i) => (counts[next] > 0
          ? fillAcc.concat(getFeatureColor(selectedFeature, next, i))
          : fillAcc
        ), []);

      const details = {
        theme: condition.theme.filter((v, i, a) => a.indexOf(v) === i),
        phase: `phase.${condition.phase}`,
        type: `type.${(condition.standardCondition) ? 'STANDARD' : 'NON_STANDARD'}`,
        status: `status.${condition.status}`,
        filing: `filing.${(condition.filingRequired) ? 'REQUIRED' : 'NOT_REQUIRED'}`,
      };

      // TODO: keywords needs to be matched search keywords...
      acc.push({
        id: condition.id,
        fill,
        details,
        binnedValue: condition.textLength,
        keywords: [''],
        text: condition.text,
        conditionNumber: condition.conditionNumber,
      });
      return acc;
    }, []);

    // This is used to show all regions belonging to an instrument
    const allLocations = regions.reduce((acc, next) => {
      acc.push(`${next.name}${next.province ? `, ${next.province}` : ''}`);
      return acc;
    }, []);

    return {
      instrumentNumber: number,
      id: instrument.id,
      issuanceDate: dateIssuance,
      effectiveDate: dateEffective,
      sunsetDate: dateSunset,
      status,
      location: allLocations,
      documentNumber,
      conditions: formattedConditions,
    };
  }));
