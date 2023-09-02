import { ConnectionOptions } from 'typeorm';
import { entities } from 'src/libs/typeorm/entities';
import { migrations } from 'src/libs/typeorm/migrations';

import {
  IS_PRODUCTION,
  IS_TEST,

  // Envvars for default database connection
  PG_HOST,
  PG_PORT,
  PG_USER,
  PG_PASSWORD,
  PG_DATABASE,

  // Envvars for read replica database connection
  PG_RO_HOST,
  PG_RO_PORT,
  PG_RO_USER,
  PG_RO_PASSWORD
} from 'src/configs/app';

export const OrmConfig = {
  // synchronize: !IS_PRODUCTION, // npm run migration:generate -- <MigrationName>
  logging:     !IS_PRODUCTION && !IS_TEST,
  entities,
  migrations,
  subscribers: [],
  cli:         {
    entitiesDir:   'src/libs/typeorm/entities',
    migrationsDir: 'src/libs/typeorm/migrations'
  },

  // Will be overwritten by env vars refer .env.example
  type: 'postgres',

  // DB Extensions need ADMIN privileges to install. We disable it here since it will always fail using app credentials
  installExtensions: false,
  extra:             {
    // db.getClient wait time on a full pool connection before timing out
    connectionTimeoutMillis: 10000,

    // time before the pool releases the client and db.getClient has to reconnect
    idleTimeoutMillis: 60000,

    // time to consider query is taking too long
    statement_timeout: 360000, // 6 minutes

    // Increase the default pool of 10 connections for node-pg
    // https://github.com/typeorm/typeorm/blob/master/docs/connection-options.md#common-connection-options
    // https://node-postgres.com/api/pool
    // Rough guideline on what is the right max number
    // max = (max_connection / instance_count) - instance_count
    // eg 103 = (4000 / 30) - 30
    // -- max_connection = https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Managing.Performance.html
    // -- instance_count = number of connected instance inclusive of queue runners & crons for the whole cluster
    max: IS_PRODUCTION ? 50 : 10
  },
  replication: {
    // read-write connection
    master: {
      database: PG_DATABASE,
      host:     PG_HOST,
      port:     PG_PORT,
      username: PG_USER,
      password: PG_PASSWORD
    },
    slaves: [
      {
        database: PG_DATABASE,
        host:     PG_RO_HOST,
        port:     PG_RO_PORT,
        username: PG_RO_USER,
        password: PG_RO_PASSWORD
      }
    ]
    // read-only connection
  }
} as ConnectionOptions;
