export default (year, xScale) => {
  const unpaddedWidth = xScale.step();
  const paddingWidth = unpaddedWidth * xScale.padding();

  return xScale(year) - paddingWidth / 2;
};
