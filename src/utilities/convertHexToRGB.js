export default (hex, alpha = 1) => {
  const rgb = hex
    .match(/[^#]{2}/g) // takes out the # and separates into pairs
    .map(seg => parseInt(seg, 16));
    // if hex is 3 digits, return hex un-altered.
  return rgb.length === 3 ? `rgba(${rgb.join(', ')}, ${alpha})` : hex;
};
