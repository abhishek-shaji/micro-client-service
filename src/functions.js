const { http } = require('@abhishek-shaji/micro-common/serverless');

module.exports = {
  /*
   * Health check
   */
  health: http('GET', '/health', 'health/health'),
  /*
   * Content
   */
  get_content: http('GET', '/{merchantId}/{contentSchemaId}/{contentId}', '/content/get'),
  list_content: http('GET', '/{merchantId}/{contentSchemaId}', '/content/list'),
  create_content: http('POST', '/{merchantId}/{contentSchemaId}', '/content/create'),
  update_content: http('PUT', '/{merchantId}/{contentSchemaId}/{contentId}', '/content/update'),
  publish_content: http('POST', '/{merchantId}/{contentSchemaId}/{contentId}/publish', '/content/publish'),
  unpublish_content: http('POST', '/{merchantId}/{contentSchemaId}/{contentId}/unpublish', '/content/unpublish'),
  delete_content: http('DELETE', '/{merchantId}/{contentSchemaId}/{contentId}', '/content/delete'),
  /*
   * Content Schema
   */
  get_content_schema: http('GET', '/content-schema/{merchantId}/{contentSchemaId}', '/content-schema/get'),
  list_content_schema: http('GET', '/content-schema/{merchantId}', '/content-schema/list'),
  create_content_schema: http('POST', '/content-schema/{merchantId}', '/content-schema/create'),
  update_content_schema: http('PUT', '/content-schema/{merchantId}/{contentSchemaId}', '/content-schema/update'),
  delete_content_schema: http('DELETE', '/content-schema/{merchantId}/{contentSchemaId}', '/content-schema/delete'),
};
