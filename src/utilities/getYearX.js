export default (year, xScale, bars, padding, hasCenteredProjectionLine) => {
  let x = xScale(year);

  if (bars) {
    const widths = bars
      .filter(bar => bar.data.indexValue === year.toString())
      .map(bar => bar.width);
    const maxWidth = Math.max(...widths);

    if (!hasCenteredProjectionLine) x += Math.round(maxWidth / 2);
    else x -= Math.round((maxWidth * padding) / 2);
  }

  return x;
};
