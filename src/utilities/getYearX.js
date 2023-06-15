export default (year, xScale, bars, padding) => {
  let x = xScale(year);

  if (bars && padding) {
    const widths = bars
      .filter(bar => bar.data.indexValue === year.toString())
      .map(bar => bar.width);
    const maxWidth = Math.max(...widths);

    const unpaddedWidth = maxWidth / (1 - padding);

    x -= (unpaddedWidth * padding) / 2;
  }

  return x;
};
