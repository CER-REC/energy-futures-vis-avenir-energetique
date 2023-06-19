export default (year, xScale) => {
  const unpaddedWidth = xScale.step();
  const paddingWidth = unpaddedWidth * xScale.padding();

  return xScale(year) + xScale.bandwidth() + paddingWidth / 2;
};
