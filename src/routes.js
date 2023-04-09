const http = (method, path, handler, allowAnyDomain) => {
  return {
    handler: `src/lambdas/${handler}.lambda.default`,
    events: [
      {
        http: {
          path: path.substring(1),
          method: method.toLowerCase(),
          cors: allowAnyDomain
            ? {
                origin: '*',
                headers: [
                  'Content-Type',
                  'X-Amz-Date',
                  'Authorization',
                  'X-Api-Key',
                  'X-Amz-Security-Token',
                  'X-Amz-User-Agent',
                  'X-Order-Secret',
                ],
                allowCredentials: true,
              }
            : undefined,
        },
      },
    ],
  };
};

module.exports = {
  /*
   * Health check
   */
  health: http('GET', '/health', 'health/health'),
  /*
   * Customer
   */
  get: http('GET', '/{merchantId}/{customerId}', 'customer/get'),
  list: http('GET', '/{merchantId}', 'customer/list'),
  create: http('POST', '/{merchantId}', 'customer/create'),
  update: http('PUT', '/{merchantId}/{customerId}', 'customer/update'),
};
