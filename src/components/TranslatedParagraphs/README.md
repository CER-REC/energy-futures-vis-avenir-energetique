# Translated Paragraphs

This utility component splits a multiline string into multiple `<p>` tags, and is intended for use with the `<AdvancedFormattedMessage>` utility.

## Usage

```javascript
const text = `Midway upon the journey of our life
I found myself within a forest dark,
For the straightforward pathway had been lost.`;

<TranslatedParagraphs>
  {text}
</TranslatedParagraphs>
```

would render:

```html
<p>Midway upon the journey of our life</p>
<p>I found myself within a forest dark,</p>
<p>For the straightforward pathway had been lost.</p>
```
