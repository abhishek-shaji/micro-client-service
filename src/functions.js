const { http } = require('@abhishek-shaji/micro-common/serverless');

module.exports = {
  /*
   * Health check
   */
  health: http('GET', '/health', 'health/health'),
  /*
   * Page Data
   */
  landing_page_data: http('GET', '/page-data/landing-page/{merchantId}', '/page-data/landing-page', true),
  product_page_data: http('GET', '/page-data/product-page/{merchantId}/{productId}', '/page-data/product-page', true),
  product_list_page_data: http('GET', '/page-data/product-list-page/{merchantId}/{categorySlug}', '/page-data/product-list-page', true),
  /*
   * Search
   */
  search_products: http('GET', '/search/products/{merchantId}', '/search/products', true),
};
