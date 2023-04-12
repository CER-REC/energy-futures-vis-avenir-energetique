import { useIntl } from 'react-intl';
import useConfig from './useConfig';
import { PAGES } from '../constants';

export default () => {
  const intl = useIntl();
  const { config } = useConfig();
  const currPage = PAGES.find(page => page.id === config.page);

  const defaultMessage = intl.formatMessage({ id: `components.pageSelect.${currPage.label}.title.default` });

  switch (currPage?.id) {
    case 'by-region':
      return intl.formatMessage({
        id: `components.pageSelect.${currPage.label}.title.${config.mainSelection}`,
        defaultMessage,
      });
    case 'by-sector':
      return intl.formatMessage({
        id: `components.pageSelect.${currPage.label}.title.${config.sector}`,
        defaultMessage,
      });
    case 'electricity':
      return intl.formatMessage({
        id: `components.pageSelect.${currPage.label}.title.${config.view}`,
        defaultMessage,
      });
    case 'scenarios':
      return intl.formatMessage({
        id: `components.pageSelect.${currPage.label}.title.${config.mainSelection}`,
        defaultMessage,
      });
    case 'oil-and-gas':
      return intl.formatMessage({
        id: `components.pageSelect.${currPage.label}.title.${config.mainSelection}.${config.view}`,
        defaultMessage,
      });
    default:
      return currPage?.label;
  }
};
