// Array.join() doesn't work for arrays of JSX elements, since it reduces them to "[Object object]"
export default (arr, joinWith) => {
  if (!arr || arr.length < 2) { return arr; }

  const out = [arr[0]];
  for (let i = 1; i < arr.length; i += 1) {
    out.push(joinWith, arr[i]);
  }
  return out;
};
