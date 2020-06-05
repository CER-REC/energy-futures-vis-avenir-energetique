# Translations

Internationalization is implemented with the [React Intl](https://github.com/yahoo/react-intl)
library.

## Language JSON

The JSON files are structured hierarchically and found in `app/languages/`.

```json
{
  "common": {
    "features": {
      "theme": "Theme",
      "instrument": "Instrument",
      "phase": "Phase",
      "type": "Type",
      "status": "Status",
      "filing": "Filing"
    },
    "trend": {
      "title": "Trends & Definitions"
    }
  }
}
```

The JSON files are later flatten at runtime with dot separated key names.
The dot separated key name is the ID of the language translation message.

```json
{
  "common.features.theme": "Theme",
  "common.features.instrument": "Instrument",
  "common.features.phase": "Phase",
  "common.features.type": "Type",
  "common.features.status": "Status",
  "common.features.filing": "Filing",
  "common.trend.title": "Trends & Definitions"
}
```

## Components

### Web Component Method (no child)

```js
import { FormattedMessage } from 'react-intl';

const Component = (props) => {
  // By default `tagName` is span, and renders as <span>{translation}</span>
  return <FormattedMessage id="component.translation" tagName="span" />;
};

export default Component;
```

### Web Component Method (function child)

```js
import { FormattedMessage } from 'react-intl';

const Component = (props) => {
  return (
    // If more control is needed over the rendered translation
    <FormattedMessage id="component.translation">
      {text => <span className="component">{text}</span>}
    </FormattedMessage>
  );
};

export default Component;
```

### API Method

```js
import { injectIntl, intlShape } from 'react-intl';

const Component = (props) => {
  const { intl } = props;
  // If translation is needed outside of JSX
  const translation = intl.formatMessage({ id: 'component.translation' });
  ...
  return <span>{translation}</span>;
};

Component.propTypes = {
  /** For translations */
  intl: intlShape.isRequired,
};

export default injectIntl(Component);
```

## Storybook

If the component uses the API method (with injectIntl), then the Story Source in Storybook for the
component will render `<InjectIntl(Component) />` instead of `<Component />`. Calling the `fixInfo`
function in `stories.jsx` will fix this issue.

```js
...
import { storiesForComponent, fixInfo } from '../../../.storybook/utils';
...
fixInfo(Component);
...
storiesForComponent('Components|Component', module, ReadMe)
...
```

## Tests

The `ShallowWrapper` object has been updated with a `shallowWithIntl` method, which is needed to
render `FormattedMessage` components in testing. `shallowWithIntl` accepts a object with the
translation IDs as the keys and the translation text as the values. If no object is provided, the
rendered translation cannot be guaranteed.

```js
...
const translationWrapper = wrapper.find('FormattedMessage').shallowWithIntl();
// translationWrapper.html() = '<span class="component">any translation</span>'
expect(translationWrapper.hasClass('component')).toBe(true);
...
```

```js
...
const messages = { 'component.translation': 'specific translation' };
const translationWrapper = wrapper.find('FormattedMessage').shallowWithIntl(messages);
// translationWrapper.html() = '<span class="component">specific translation</span>'
expect(translationWrapper.hasClass('component')).toBe(true);
expect(translationWrapper.text()).toContain('specific translation');
...
```

If the component uses the API method (with injectIntl), then it will need to be rendered with the
`shallowWithIntl` function from test utilities.

```js
import { shallowWithIntl } from '../../tests/utilities';
...
wrapper = shallowWithIntl(<Component />);
...
```
