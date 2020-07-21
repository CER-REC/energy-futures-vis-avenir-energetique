// @ts-check
import React, { useEffect } from 'react';
import * as d3 from 'd3';
import * as d3Path from 'd3-path';

// #region Constants

const viz5RoseData = {
  electricity:
    {
      colour: '#33cccc', // teal
      startAngle: Math.PI * (0 / 3),
      image: 'IMG/sources/electricity_selected.svg',
    },
  naturalGas:
      {
        colour: '#f16739', // orange
        startAngle: Math.PI * (1 / 3),
        image: 'IMG/sources/naturalGas_selected.svg',
      },
  bio:
      {
        colour: '#8d68ac', // purple
        startAngle: Math.PI * (2 / 3),
        image: 'IMG/sources/biomass_selected.svg',
      },
  solarWindGeothermal:
      {
        colour: '#339947', // green
        startAngle: Math.PI * (3 / 3),
        image: 'IMG/sources/solarWindGeo_selected.svg',
      },
  coal:
      {
        colour: '#996733', // brown
        startAngle: Math.PI * (4 / 3),
        image: 'IMG/sources/coal_selected.svg',
      },
  oilProducts:
      {
        colour: '#cc6699', // pink
        startAngle: Math.PI * (5 / 3),
        image: 'IMG/sources/oil_products_selected.svg',
      },
};

const petalLayers = [
  {
    layer: 0,
    class: 'petal1',
    darken: 0,
  },
  {
    layer: 1,
    class: 'petal2',
    darken: 0.9,
  },
  {
    layer: 2,
    class: 'petal3',
    darken: 1.8,
  },
  {
    layer: 3,
    class: 'petal4',
    darken: 2.7,
  },
];

const roseAngles = [
  0,
  Math.PI * (1 / 3),
  Math.PI * (2 / 3),
  Math.PI * (3 / 3),
  Math.PI * (4 / 3),
  Math.PI * (5 / 3),
];

const roseTickDistances = [
  -15,
  -10,
  -5,
  5,
  10,
  15,
];

const roseOuterCircleRadius = 55;
const roseCentreCircleRadius = 12;
const mapleLeafCircleRadius = 11.5;
const mapleLeafCircleStroke = 0.5;
const mapleLeafScale = 0.065;
const mapleLeafCenterOffset = 2;
const mapleLeafPath = 'm 154.99433,0 -25.06359,46.7528 c -2.844,5.08126 -7.93959,4.60996 -13.03517,1.77192 l -18.14538,-9.39723 13.52402,71.81132 c 2.844,13.11953 -6.28082,13.11953 -10.78395,7.44687 L 69.82305,82.93015 64.68194,100.93531 c -0.59287,2.36446 -3.19957,4.84789 -7.11025,4.25649 l -40.04353,-8.42033 10.51769,38.24325 c 2.25156,8.50956 4.00782,12.03281 -2.27304,14.27716 L 11.5,156.00092 80.43236,211.99997 c 2.72839,2.11737 4.10687,5.92775 3.13555,9.37778 l -6.03305,19.8011 c 23.73443,-2.73623 45.00085,-6.85284 68.74731,-9.38813 2.09632,-0.22382 5.60582,3.23618 5.59142,5.66585 L 148.72882,310 l 11.5398,0 -1.81651,-72.38785 c -0.0145,-2.42967 3.16938,-6.04525 5.26571,-5.82143 23.74645,2.5353 45.0129,6.6519 68.74732,9.38813 l -6.03303,-19.8011 c -0.97132,-3.45003 0.40715,-7.26041 3.13554,-9.37778 L 298.5,156.00092 284.2272,149.29188 c -6.28088,-2.24435 -4.52461,-5.7676 -2.27305,-14.27716 l 10.51772,-38.24325 -40.04357,8.42033 c -3.91067,0.5914 -6.51737,-1.89203 -7.11026,-4.25649 l -5.1411,-18.00516 -31.6672,35.45553 c -4.50314,5.67266 -13.62798,5.67266 -10.78397,-7.44687 l 13.524,-71.81132 -18.14534,9.39723 c -5.09571,2.83804 -10.19117,3.30934 -13.03518,-1.77192';
const roseBaselineCircleRadius = 35;
const roseTickLength = 8;
const roseRadiusCap = 20;
const petalCapOverhang = 2;
const roseThornLength = 4;
const thornWidth = 8;
// #endregion

// eslint-disable-next-line
const Rose = ({ provinceData }) => {
  // const [innerCircle, innerCircleSet] = useState();

  // #region Methods
  const petalPath = (rawValue, startAngle, petalLayer) => {
    // First part: compute how large the petal and thorn are

    // Each petal layer is responsible for rendering values in a certain range.
    // There are three cases:
    // 1 The value exceeds the range of this layer: render the petal at maximum size with
    //   no thorn.
    // 2 The value falls within the range this layer is responsible for: render the petal
    //   at part of its full length, with a thorn
    // 3 The value is too small to reach this layer: we render nothing

    // To avoid repeating ourselves, we do all the math as though the value were positive,
    // and flip the sign if needed at the end.
    // NB also: Math.floor with negative numbers behaves in a way some find unexpected
    // e.g. Math.floor(1.5) === 1 but Math.floor(-1.5) === -2
    const absValue = Math.abs(rawValue);
    // This is the petal layer which handles case 2 above
    const partialLayer = Math.floor(absValue / roseRadiusCap);
    // console.log(partialLayer);

    // In all cases, we begin with the petal distance set at the baseline, which if used
    // to draw a path would result in a petal with zero size.
    let petalDistance = roseBaselineCircleRadius;
    let capped;
    let thorn;
    let thornDistance;

    if (petalLayer.layer < partialLayer) {
      // Draw this petal at full size with no thorn
      if (rawValue > 0) petalDistance += roseRadiusCap;
      else {
        petalDistance -= roseRadiusCap;
        capped = true;
        thorn = false;
      }
    } else if (petalLayer.layer === partialLayer) {
      // Draw this petal at partial size, with thorn
      const value = absValue - petalLayer.layer * roseRadiusCap;
      if (rawValue > 0) petalDistance += value;
      else {
        petalDistance -= value;
        capped = false;
        thorn = true;
      }
    } else if (petalLayer.layer > partialLayer) {
      // Don't draw this petal layer or thorn
      capped = false;
      thorn = false;
    }

    // Special handling for the first layer thorn: we always want there to be one thorn,
    // but when the data is at zero, no petal layers or thorns would be drawn.
    if (petalLayer.layer === 0 && rawValue === 0) thorn = true;

    // Special handling for the first layer: if this layer is at maximum value, we extend
    // the petal just a little bit, so that the base colour of the petal remains visible
    // alongside the darker petal layers.
    if (petalLayer.layer === 0 && capped) {
      if (rawValue > 0) petalDistance += petalCapOverhang;
      else petalDistance -= petalCapOverhang;
    }
    if (!thorn) thornDistance = petalDistance;
    else if (rawValue < 0) { // pointed inward
      thornDistance = petalDistance - roseThornLength;
    } else {
      // pointed outward
      thornDistance = petalDistance + roseThornLength;
    }

    // It's important that the petal distance not be zero.
    // If it is zero, the d3-path.arc function won't generate one of the arcs in the path.
    // Then, since the path structure for this petal doesn't match the structure for paths
    // with values higher than zero, the interpolation based path animations don't work
    // correctly. For info about path animations: https://bost.ocks.org/mike/path/
    petalDistance = petalDistance <= 0 ? 0.0000001 : petalDistance;

    // In practice, this means that 'absent' layers are actually rendered as extremely
    // tiny petals, which are hidden by the baseline stroke, as it is layered above them.

    // ////// Second part: compute points for the petal's path and the path string

    // A petal is composed of an outer arc, which is broken in two by a thorn (a triangular
    // point) in the middle, and an unbroken inner arc. The inner arc always lies along
    // the baseline circle of the rose, the outer arc may be closer to the origin or more
    // distant (i.e. greater or lower radius) from the baseline depending on its data
    // value.

    const finalAngle = startAngle + Math.PI * (1 / 3);

    const thornAngle = startAngle + Math.PI * (1 / 6);

    const thornAngularWidth = Math.acos(Math.sqrt(
      petalDistance * petalDistance - (thornWidth / 2) * (thornWidth / 2),
    ) / petalDistance);
    const thornBaseStartAngle = thornAngle - thornAngularWidth;
    const thornBaseEndAngle = thornAngle + thornAngularWidth;

    // First, we compute all of the points with which we will be drawing lines

    // First point in the first outer arc
    const outerArc1X1 = petalDistance * Math.cos(startAngle);
    const outerArc1Y1 = petalDistance * Math.sin(startAngle);

    // Second point in the first outer arc, base of the thorn
    // const outerArc1X2 = petalDistance * Math.cos(thornBaseStartAngle);
    // const outerArc1Y2 = petalDistance * Math.sin(thornBaseStartAngle);

    // Point of the thorn
    const thornPointX = thornDistance * Math.cos(thornAngle);
    const thornPointY = thornDistance * Math.sin(thornAngle);

    // First point in the second outer arc, base of the thorn
    const outerArc2X1 = petalDistance * Math.cos(thornBaseEndAngle);
    const outerArc2Y1 = petalDistance * Math.sin(thornBaseEndAngle);

    // Second point in the second outer arc
    // const outerArc2X2 = petalDistance * Math.cos(finalAngle);
    // const outerArc2Y2 = petalDistance * Math.sin(finalAngle);

    // Points defining the lower arc
    // const lowerArcX1 = roseBaselineCircleRadius * Math.cos(startAngle);
    // const lowerArcY1 = roseBaselineCircleRadius * Math.sin(startAngle);

    const lowerArcX2 = roseBaselineCircleRadius * Math.cos(finalAngle);
    const lowerArcY2 = roseBaselineCircleRadius * Math.sin(finalAngle);

    const path = d3Path.path();

    // First outer arc
    path.moveTo(outerArc1X1, outerArc1Y1);
    path.arc(0, 0, petalDistance, startAngle, thornBaseStartAngle);

    // Thorn leg 1
    path.lineTo(thornPointX, thornPointY);

    // Thorn leg 2
    path.lineTo(outerArc2X1, outerArc2Y1);

    // Second outer arc
    path.arc(0, 0, petalDistance, thornBaseEndAngle, finalAngle);

    // Line to lower arc
    path.lineTo(lowerArcX2, lowerArcY2);

    // Lower arc, always lies along the baseline circle
    path.arc(0, 0, roseBaselineCircleRadius, finalAngle, startAngle, true);

    // End!
    path.closePath();

    return path.toString();
  };

  const renderFullRose = (innerContainer, provData) => {
    innerContainer.selectAll('.roseAxisLine, .roseOuterCircle');

    // Outer circle
    innerContainer.append('circle')
      .attr('class', 'roseOuterCircleStroke')
      .attr('r', roseOuterCircleRadius)
      .attr('stroke', '#ccc')
      .attr('stroke-width', 0.5)
      .attr('fill', 'none');

    // Tickmarks
    roseTickDistances.forEach((distance) => {
    //   # Tickmarks are each the same length, but are drawn as tiny arcs.
    //   # So, the angular width of the arc is different for each set of tickmarks
      const tickmarkRadius = roseBaselineCircleRadius + distance;
      const tickmarkCircumference = 2 * Math.PI * tickmarkRadius;
      const angularWidth = (roseTickLength / tickmarkCircumference) * 2 * Math.PI;

      roseAngles.forEach((angle) => {
        const startAngle = angle - angularWidth / 2;
        const endAngle = angle + angularWidth / 2;

        // Compute the start point of the tickmark, using a ray from the centre of the rose
        const startX = tickmarkRadius * Math.cos(startAngle);
        const startY = tickmarkRadius * Math.sin(startAngle);

        const path = d3Path.path();
        path.moveTo(startX, startY);
        path.arc(0, 0, tickmarkRadius, startAngle, endAngle);

        innerContainer.append('path')
          .attr('class', 'roseTickMark')
          .attr('stroke', '#ccc')
          .attr('stroke-width', 0.5)
          .attr('d', path.toString())
          .attr('fill', 'none');
      });
    });

    // Petals
    petalLayers.forEach((petalLayer) => {
      innerContainer.selectAll(`.${petalLayer.class}`)
        .data(provData)
        .enter()
        .append('path')
        .attr('class', d => `petalLayer ${petalLayer.class} ${d.source}`)
        .attr('fill', d => d3.hsl(viz5RoseData[d.source].colour).darker(petalLayer.darken))
        .attr('d', d => petalPath(d.value, viz5RoseData[d.source].startAngle, petalLayer));
    });
    // # Baseline circle
    innerContainer.append('circle')
      .attr('class', 'roseBaselineCircle')
      .attr('r', roseBaselineCircleRadius)
      .attr('stroke', '#333')
      .attr('stroke-width', 0.75)
      .attr('fill', 'none');
  };

  const drawInnerCircle = (container, provData) => {
    // Add an inner group for internal transforms.
    const innerContainer = container
      .append('g')
      .attr('class', 'rose')
      .attr('transform', `translate(${roseOuterCircleRadius}, ${roseOuterCircleRadius})`);

    // Outer circle
    // Similar to the axes, make the scale of the outer circle zero, so that it is not
    // visible
    innerContainer.append('circle')
      .attr('class', 'roseOuterCircle')
      .attr('r', roseOuterCircleRadius)
      .attr('stroke', 'none')
      .attr('stroke-width', 0.5)
      .attr('fill', 'white')
      .attr('transform', 'scale(0,0)');

    // Draw the axes, but set its scale to zero so it is invisible. This is
    // done here so that the axes are positioned behind the inner circle.
    roseAngles.forEach((angle) => {
      innerContainer.append('line')
        .attr('class', 'roseAxisLine')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 0.5)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', roseOuterCircleRadius * Math.cos(angle))
        .attr('y2', roseOuterCircleRadius * Math.sin(angle))
        .attr('stroke-dasharray', '2,2')
        .attr('transform', 'scale(0, 0)');
    });

    // Centre circle
    innerContainer.append('circle')
      .attr('class', 'roseCentreCircle')
      .attr('r', roseCentreCircleRadius)
      .attr('fill', '#333')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.0);

    // Render the maple leaf instead of the text
    // label for the Canada rose
    // This is kind of a hack. For some reason, I can't seem to get an <image> tag
    // to render on the server for the image download, which causes the maple leaf
    // not to show on the image. This works, but is a bit messy.
    if (provData[0].province === 'Canada') {
      innerContainer.append('circle')
        .attr('class', 'pointerCursor')
        .attr('id', 'mapleLeafCircle')
        .attr('r', mapleLeafCircleRadius)
        .attr('stroke-width', mapleLeafCircleStroke)
        .attr('fill', '#fff')
        .attr('stroke', '#f00');
      innerContainer.append('g')
        .attr('transform', `translate(-${roseCentreCircleRadius - mapleLeafCenterOffset}, -${roseCentreCircleRadius - mapleLeafCenterOffset}) scale(${mapleLeafScale}, ${mapleLeafScale})`)
        .attr('class', 'pointerCursor')
        .attr('id', 'mapleLeafSVGgroup')
        .append('path')
        .attr('class', 'pointerCursor')
        .attr('id', 'mapleLeafSVG')
        .attr('fill', '#f00')
        .attr('d', mapleLeafPath);

      // Centre label
      innerContainer.append('text')
        .attr('class', 'roseCentreLabel hidden')
        .attr('fill', 'none')
        .attr('transform', 'translate(0, 4.5)')
        .attr('text-anchor', 'middle')
        .style('font-size', '13px')
        .text(() => provData[0].province);
    } else {
      // Centre label
      innerContainer.append('text')
        .attr('class', 'roseCentreLabel')
        .attr('fill', 'white')
        .attr('transform', 'translate(0, 4.5)')
        .attr('text-anchor', 'middle')
        .style('font-size', '13px')
        .text(() => provData[0].province);

      // for whatever reason, this code that draws the leaf was in here
      // innerContainer.append('circle')
      //   .attr('class', 'hidden')
      //   .attr('id', 'mapleLeafCircle')
      //   .attr('r', mapleLeafCircleRadius)
      //   .attr('stroke-width', mapleLeafCircleStroke)
      //   .attr('fill', '#fff')
      //   .attr('stroke', '#f00');
      // innerContainer.append('g')
      //   .attr('transform', `translate(-${12 - 2},
      // -${12 - 2}) scale(${mapleLeafScale}, ${mapleLeafScale})`)
      //   .append('path')
      //   .attr('class', 'pointerCursor hidden')
      //   .attr('id', 'mapleLeafSVG')
      //   .attr('fill', '#f00')
      //   .attr('d', mapleLeafPath);
    }
    return innerContainer;
  };

  const updateSVG = () => {
    // eslint-disable-next-line
    const innerCircle = drawInnerCircle(d3.select(`.flower-${provinceData[0].province}`), provinceData);
    renderFullRose(innerCircle, provinceData);
  };
  // #endregion

  useEffect(() => {
    updateSVG();
  });

  // eslint-disable-next-line
  return <svg className={`flower-${provinceData[0].province}`} height={150} width={150} />;
};

export default Rose;
