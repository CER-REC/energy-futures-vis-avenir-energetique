export default (data) => {
  if (!data)
    return true;

  let zeroData = true;

  data.forEach(scenario => {
    let checkZeroedData = scenario.data.filter(info => info.y !== 0);

    if (checkZeroedData.length > 0) {
      zeroData = false;
      return false;
    }
  })

  return zeroData;
}
