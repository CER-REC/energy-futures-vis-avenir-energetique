export default (year, xScale, bars) => {
  let x = xScale(year);

  if (bars) {
    const widths = bars
      .filter(bar => bar.data.indexValue === year.toString())
      .map(bar => bar.width);
    const maxWidth = Math.max(...widths);

    // xScale returns the starting x for bars
    x += Math.round(maxWidth / 2);
  }

  return x;
};
