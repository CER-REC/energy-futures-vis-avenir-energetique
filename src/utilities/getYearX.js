export default (year, xScale, bars, padding) => {
  let x = xScale(year);

  if (bars) {
    const widths = bars
      .filter(bar => bar.data.indexValue === year.toString())
      .map(bar => bar.width);
    const maxWidth = Math.max(...widths);
    const barRatio = Math.min((1 - padding), 1) || 1;
    const unpaddedWidth = maxWidth / barRatio;

    x -= (unpaddedWidth * padding) / 2;
  }

  return x;
};
