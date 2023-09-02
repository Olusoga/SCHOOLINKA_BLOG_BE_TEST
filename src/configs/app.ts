/* eslint-disable linebreak-style */
/* eslint no-process-env: "off" */

// NOTE: All env vars from process.env are imported as STRINGS. It is important to keep this in mind and cast your env vars as needed.

export const { NODE_ENV, APP_ENV, APP_MODE, RABBITMQ_URL, JWT_TOKEN_SECRET } = process.env;

export const SERVICE_NAME = process.env.SERVICE_NAME;
export const PORT = process.env.PORT || '3000';

export const NODE_KEEP_ALIVE_TIMEMOUT_MS = Number( process.env.NODE_KEEP_ALIVE_TIMEMOUT_MS ) || 65_000;

export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_LOCAL = NODE_ENV === 'local';
export const IS_TEST = NODE_ENV === 'test';

// Envvars for default database connection
export const PG_DATABASE = process.env.PG_DATABASE || 'test';
export const PG_HOST = process.env.PG_HOST || 'localhost';
export const PG_PORT = Number( process.env.PG_PORT ) || 5432;
export const PG_USER = process.env.PG_USER || 'test';
export const PG_PASSWORD = process.env.PG_PASSWORD || 'test';

// Envvars for read replica database connection; defaults to default db connection
export const PG_RO_HOST = process.env.PG_RO_HOST || PG_HOST;
export const PG_RO_PORT = Number( process.env.PG_RO_PORT ) || PG_PORT;
export const PG_RO_USER = process.env.PG_RO_USER || PG_USER;
export const PG_RO_PASSWORD = process.env.PG_RO_PASSWORD || PG_PASSWORD;
