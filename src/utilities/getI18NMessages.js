export default translations => (
  translations.reduce((i18nMessages, translation) => {
    let key;

    switch (translation.group) {
      case 'REGION':
        key = `common.regions.${translation.key}`;
        break;
      case 'SCENARIO':
        key = `common.scenarios.${translation.key}`;
        break;
      case 'ELECTRICITY_SOURCE':
        key = `common.sources.electricity.${translation.key}`;
        break;
      case 'ENERGY_SOURCE':
        key = `common.sources.energy.${translation.key}`;
        break;
      case 'GAS_SOURCE':
        key = `common.sources.gas.${translation.key}`;
        break;
      case 'OIL_SOURCE':
        key = `common.sources.oil.${translation.key}`;
        break;
      case 'TRANSPORTATION_OIL_ENERGY_SOURCE':
        key = `common.sources.transportation.${translation.key}`;
        break;
      case 'SECTOR':
        key = `common.sectors.${translation.key}`;
        break;
      default:
        return i18nMessages;
    }

    // eslint-disable-next-line no-param-reassign
    i18nMessages.en[key] = translation.english;
    // eslint-disable-next-line no-param-reassign
    i18nMessages.fr[key] = translation.french;

    return i18nMessages;
  }, { en: {}, fr: {} })
);
