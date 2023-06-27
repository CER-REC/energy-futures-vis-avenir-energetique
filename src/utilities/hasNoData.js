export default (rawData) => {
  if (!rawData) return true;

  const checkZeroedData = rawData.filter(row => row.value !== 0);

  return checkZeroedData.length <= 0;
};
