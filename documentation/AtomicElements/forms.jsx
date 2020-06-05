import React from 'react';

export default () => (
  <>
    <h1> Forms </h1>

    <h2>Text Field</h2>
    <input type="text" placeholder="Text Input" />

    <h2>Text Area</h2>
    <textarea placeholder="Text Area" />

    <h2>Select List</h2>
    <select>
      <optgroup label="Option Group">
        <option>Option One</option>
        <option>Option Two</option>
        <option>Option Three</option>
      </optgroup>
    </select>

    <h2>Radio Buttons</h2>
    <label htmlFor="radio1">
      <input type="radio" onChange={() => {}} id="radio1" name="radio" value="Radio 1" checked />
      Radio 1
    </label>
    <br />
    <label htmlFor="radio2">
      <input type="radio" onChange={() => {}} id="radio2" name="radio" value="Radio 2" />
      Radio 2
    </label>

    <h2>Checkbox</h2>
    <label htmlFor="check1">
      <input type="checkbox" onChange={() => {}} id="check1" name="checkbox" value="Checkbox 1" checked />
      Checkbox 1
    </label>
    <br />
    <label htmlFor="check2">
      <input type="checkbox" onChange={() => {}} id="check2" name="checkbox" value="Checkbox 2" />
      Checkbox 2
    </label>
  </>
);
