const routes = require('./src/routes');

module.exports = {
  service: 'micro-customer-service',
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    stage: '${opt:stage, "dev"}',
    region: 'eu-central-1',
    environment: {
      ENV: '${opt:stage, "dev"}',
      DATABASE_URL: '${ssm:/database-url-${opt:stage, "dev"}}',
      JWT_SECRET: '${ssm:/jwt-secret-${opt:stage, "dev"}}',
      RECAPTHA_PRIVATE_KEY: '${ssm:/recaptcha-private-key-${opt:stage, "dev"}}',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['sqs:SendMessage'],
        Resource: [
          'arn:aws:sqs:eu-central-1:045308480883:payment_status_update_${opt:stage, "dev"}.fifo',
        ],
      },
    ],
  },
  plugins: [
    'serverless-esbuild',
    'serverless-iam-roles-per-function',
    'serverless-domain-manager',
    'serverless-newrelic-lambda-layers',
  ],
  custom: {
    domainName: {
      dev: 'api-dev.shophost.io',
      prod: 'api.shophost.io',
    },
    customDomain: {
      domainName: '${self:custom.domainName.${opt:stage, "dev"}}',
      basePath: 'customer',
      stage: '${opt:stage, "dev"}',
      createRoute53Record: false,
    },
    newRelic: {
      nrRegion: 'eu',
      accountId: '${ssm:/new-relic-account-id}',
      apiKey: '${ssm:/new-relic-api-key}',
      enableFunctionLogs: true,
    },
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: false,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: {
        'require.resolve': 'undefined',
      },
      platform: 'node',
      concurrency: 10,
    },
  },
  package: {
    individually: true,
    exclude: [
      '*',
      '.*/**',
      'CHANGELOG/**',
      '.build/**',
      '.output/**',
      'infrastructure/**',
      'node_modules/**',
      'scripts/**',
      'tests/**',
    ],
    include: ['src/**/*.ts', 'package.json', '!src/**/__tests__/**'],
  },
  functions: routes,
};
