export default (result) => {
  if (!result.error) { return; }

  const { graphQLErrors, networkError } = result.error;
  const error = new Error(result.error.message);

  error.graphQLErrors = [];
  if (graphQLErrors.length) {
    error.graphQLErrors = graphQLErrors.map(v => JSON.stringify(v));
  }

  if (networkError) {
    const networkDetails = { ...networkError.result };
    if (networkDetails.errors) {
      networkDetails.errors = `\n${networkDetails.errors.map(v => `    ${v.message}`).join('\n')}`;
    }
    if (networkDetails.StackTrace) {
      networkDetails.StackTrace = networkDetails.StackTrace
        .split('\n')
        .map(v => `  ${v}`)
        .join('\n');
      networkDetails.StackTrace = `\n${networkDetails.StackTrace}`;
    }
    const formattedNetwork = Object.entries(networkDetails)
      .map(([k, v]) => `  ${k}: ${v}`)
      .join('\n');
    error.networkError = `${networkError.message}\n${formattedNetwork}`;
  }

  // Immediately throw the error so that it is caught by our ErrorBoundary
  throw error;
};
