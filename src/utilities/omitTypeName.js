const omitTypename = (key, value) => (key === '__typename' ? undefined : value);
export default data => JSON.parse(JSON.stringify(data), omitTypename);
