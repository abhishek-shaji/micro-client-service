const { http } = require('@abhishek-shaji/micro-common/serverless');

module.exports = {
  /*
   * Health check
   */
  health: http('GET', '/health', 'health/health'),
  /*
   * Customer
   */
  get: http('GET', '/{merchantId}/{customerId}', '/customer/get'),
  list: http('GET', '/{merchantId}', '/customer/list'),
  create: http('POST', '/{merchantId}', '/customer/create'),
  update: http('PUT', '/{merchantId}/{customerId}', '/customer/update'),
};
