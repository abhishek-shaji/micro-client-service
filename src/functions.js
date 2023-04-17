const { http } = require('@abhishek-shaji/micro-common/serverless');

module.exports = {
  /*
   * Health check
   */
  health: http('GET', '/health', 'health/health'),
  /*
   * Landing Page Data
   */
  landing_page_data: http('GET', '/landing-page/{merchantId}', '/landing-page-data', true),
};
