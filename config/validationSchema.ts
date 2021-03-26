import * as Joi from '@hapi/joi';

const validationSchema = Joi.object({
  APP_NAME: Joi.string().default('Vicoders'),
  APP_ENV: Joi.string().valid('local', 'production', 'test', 'staging').default('local'),
  APP_KEY: Joi.string(),
  JWT_TTL: Joi.number(),
  APP_DEBUG: Joi.bool().default('false'),
  DB_CONNECTION: Joi.string()
    .valid('mysql', 'mariadb', 'postgres', 'cockroachdb', 'sqlite', 'mssql', 'oracle', 'mongodb', 'cordova', 'react-native', 'expo', 'nativescript')
    .default('local'),
  DB_HOST: Joi.string(),
  DB_PORT: Joi.number().default(3306),
  DB_DATABASE: Joi.string(),
  DB_USERNAME: Joi.string(),
  DB_PASSWORD: Joi.string(),
  DB_LOGGING: Joi.bool(),
  MAIL_MAILER: Joi.string().allow('').optional(),
  MAIL_HOST: Joi.string().allow('').optional(),
  MAIL_PORT: Joi.number().allow('').optional(),
  MAIL_USERNAME: Joi.string().allow('').optional(),
  MAIL_PASSWORD: Joi.string().allow('').optional(),
  MAIL_ENCRYPTION: Joi.string().allow('').optional(),
  MAIL_FROM_ADDRESS: Joi.string().email().allow('').allow('null').optional(),
  MAIL_FROM_NAME: Joi.string().allow('').optional(),
  PORT: Joi.number().default(3000),
});

export default validationSchema;
