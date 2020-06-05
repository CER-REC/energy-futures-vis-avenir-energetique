# App Container

This component has all of the other public containers as children.

## Requirements

* [x] Should display View containers 1, 2, and 3 when appropriate
* [x] Should display the Footer when appropriate
* [x] Should display the Guide when appropriate
* [x] Should display the BrowseBy buttons when appropriate

## Interaction Requirements

* [x] Should provide a series of transitional states, as per the design document's _Transition: View 1 to View 2_ and _Transition: View 2 to View 3_ sections.

  <table>
    <tr>
      <td>0</td>
      <td>
        <a href="http://ilab.cpsc.ucalgary.ca/energyvis/designdocuments/conditions/2019-02-26-Revision-6/media/exp/prod/View1/View1_Full_ScrollDown.svg" target="_blank">View 1</a>
      </td>
    </tr>
    <tr>
      <td>1</td>
      <td>
        <a href="http://ilab.cpsc.ucalgary.ca/energyvis/designdocuments/conditions/2019-02-26-Revision-6/media/exp/prod/View1/View1_Full_ScrollDown2.svg" target="_blank">View 1 -> 2, step 1</a>
      </td>
    </tr>
    <tr>
      <td>2</td>
      <td>
        <a href="http://ilab.cpsc.ucalgary.ca/energyvis/designdocuments/conditions/2019-02-26-Revision-6/media/exp/prod/Transitions/Transition1.svg" target="_blank">View 1 -> 2, step 2</a>
      </td>
    </tr>
    <tr>
      <td>3</td>
      <td>
        <a href="http://ilab.cpsc.ucalgary.ca/energyvis/designdocuments/conditions/2019-02-26-Revision-6/media/exp/prod/Transitions/Transition2.svg" target="_blank">View 1 -> 2, step 3</a>
      </td>
    </tr>
    <tr>
      <td>4</td>
      <td>
        <a href="http://ilab.cpsc.ucalgary.ca/energyvis/designdocuments/conditions/2019-02-26-Revision-6/media/exp/prod/Transitions/Transition3.svg" target="_blank">View 1 -> 2, step 4</a>
      </td>
    </tr>
    <tr>
      <td>5</td>
      <td>
        <a href="http://ilab.cpsc.ucalgary.ca/energyvis/designdocuments/conditions/2019-02-26-Revision-6/media/exp/prod/Transitions/Transition4.svg" target="_blank">View 1 -> 2, step 5</a>
      </td>
    </tr>
    <tr>
      <td>6</td>
      <td>
        <a href="http://ilab.cpsc.ucalgary.ca/energyvis/designdocuments/conditions/2019-02-26-Revision-6/media/exp/prod/Transitions/Transition5.svg" target="_blank">View 1 -> 2, step 6</a>
      </td>
    </tr>
    <tr>
      <td>7</td>
      <td>
        <a href="http://ilab.cpsc.ucalgary.ca/energyvis/designdocuments/conditions/2019-02-26-Revision-6/media/exp/prod/Transitions/Transition6.svg" target="_blank">View 1 -> 2, step 7</a>
      </td>
    </tr>
    <tr>
      <td>8</td>
      <td>
        <a href="http://ilab.cpsc.ucalgary.ca/energyvis/designdocuments/conditions/2019-03-15-Revision-7/media/exp/prod/View2/View2_Full.svg" target="_blank">View 2</a>
      </td>
    </tr>
    <tr>
      <td>9</td>
      <td>
        Reset View 2 to View 1
      </td>
    </tr>
    <tr>
      <td>10</td>
      <td>
        <a href="http://ilab.cpsc.ucalgary.ca/energyvis/designdocuments/conditions/2019-03-15-Revision-7/media/exp/prod/View3/View3_Full.svg" target="_blank">View 3</a>
      </td>
    </tr>
  </table>

## Accessibility Requirements

* [ ] The component should implement keyboard tabbing through the views and footer
