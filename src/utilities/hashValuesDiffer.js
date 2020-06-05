// Accepts two objects, a and b, and an array of key strings
// Returns true if a and b have different values for any of the given keys
export default (a, b, keys) => {
  for (let i = 0; i < keys.length; i += 1) {
    const k = keys[i];
    if (a[k] !== b[k]) { return true; }
  }

  return false;
};
