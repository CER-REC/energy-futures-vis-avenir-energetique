import useConfig from "./useConfig";
import {useIntl} from "react-intl";

export default (page) => {
  const intl = useIntl();
  const { config } = useConfig();

  const defaultMessage = intl.formatMessage({id: `components.pageSelect.${page.label}.title.default`});

  switch (page?.id) {
    case 'by-region':
      return intl.formatMessage({
        id: `components.pageSelect.${page.label}.title.${config.mainSelection}`,
        defaultMessage: defaultMessage,
      });
    case 'by-sector':
      return intl.formatMessage({
        id: `components.pageSelect.${page.label}.title.${config.sector}`,
        defaultMessage: defaultMessage,
      });
    case 'electricity':
      return intl.formatMessage({
        id: `components.pageSelect.${page.label}.title.${config.view}`,
        defaultMessage: defaultMessage,
      });
    case 'scenarios':
      return intl.formatMessage({
        id: `components.pageSelect.${page.label}.title.${config.mainSelection}`,
        defaultMessage: defaultMessage,
      });
    case 'oil-and-gas':
      return intl.formatMessage({
        id: `components.pageSelect.${page.label}.title.${config.mainSelection}.${config.view}`,
        defaultMessage: defaultMessage,
      });
    default:
      return page?.label;
  }
}
