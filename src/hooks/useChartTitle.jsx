import { useIntl } from 'react-intl';
import useConfig from './useConfig';
import { PAGES } from '../constants';

export default () => {
  const intl = useIntl();
  const { config } = useConfig();
  const currPage = PAGES.find(page => page.id === config.page);
  const scenario = config.scenarios[0];

  let title = null;
  const defaultMessage = intl.formatMessage({ id: `components.pageSelect.${currPage.label}.title.default` });

  switch (currPage?.id) {
    case 'emissions':
      title = `components.pageSelect.${currPage.label}.title`;
      break;
    case 'by-region':
      title = `components.pageSelect.${currPage.label}.title.${config.mainSelection}`;
      break;
    case 'by-sector':
      title = `components.pageSelect.${currPage.label}.title.${config.sector}`;
      break;
    case 'electricity':
      title = `components.pageSelect.${currPage.label}.title.${config.view}`;
      break;
    case 'scenarios':
      return intl.formatMessage({
        id: `components.pageSelect.${currPage.label}.title.${config.mainSelection}`,
        defaultMessage,
      });
    case 'oil-and-gas':
      title = `components.pageSelect.${currPage.label}.title.${config.mainSelection}.${config.view}`;
      break;
    default:
      return currPage?.label;
  }

  if (intl.locale === 'en') {
    return config.yearId === '2023'
      ? intl.formatMessage({ id: 'components.pageSelect.defaultTitle' },
        {
          title: intl.formatMessage({
            id: title,
            defaultMessage,
          }),
          scenario,
        })
      : intl.formatMessage({ id: title });
  }

  return config.yearId === '2023'
    ? intl.formatMessage({ id: `${title}.${scenario}` })
    : intl.formatMessage({ id: `${title}.default` });
};
