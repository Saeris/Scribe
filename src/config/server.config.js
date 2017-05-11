import dotenv  from 'dotenv' // https://github.com/motdotla/dotenv
import Winston from 'winston' // https://github.com/winstonjs/winston
import 'winston-loggly-bulk' // https://github.com/loggly/winston-loggly-bulk

dotenv.config()

class Config {
  ENV     = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || (process.env.NODE_ENV = `development`)

  // HTTP Server Settings
  http    = {
    host: `127.0.0.1`,
    port: process.env.HTTP || 1337,
    routes: {
      cors: true
    }
  }

  // HTTPS Server Settings
  https   = {
    host: `127.0.0.1`,
    port: process.env.HTTPS || 8080,
    routes: {
      cors: true
    }
  }

  // Sets the server's log level
  level   = process.env.LOGLEVEL || `info`

  // Winston Logger Settings
  winston = {
    transports: [
      new (Winston.transports.Loggly)({
        token:     process.env.LOGGLY_TOKEN,
        subdomain: process.env.LOGGLY_SUBDOMAIN,
        tags:      [`Winston-NodeJS`, `Scribe`],
        json:      true
      }),
      new (Winston.transports.Console)({
        level:            this.level,
        prettyPrint:      true,
        handleExceptions: true,
        json:             false,
        colorize:         true
      })
    ]
  }

  // Good Logger Settings
  good    = {
    ops: {
      interval: 1000
    },
    reporters: {
      winston: [{
        module: `good-winston`,
        args: [new Winston.Logger(this.winston), {
          error_level:    `error`,
          ops_level:      `debug`,
          request_level:  `debug`,
          response_level: `info`,
          other_level:    `info`
        }]
      }]
    }
  }

  // Settings for MySQL Database
  mysql   = {
    host:     process.env.DB_HOST || `127.0.0.1`,
    user:     process.env.DB_USERNAME || `root`,
    password: process.env.DB_PASSWORD || `password`,
    database: process.env.DB_NAME || `scribe`,
    charset:  `utf8`
  }

  // Settings for SQLite3 Database
  sqlite  = {
    filename: `./src/scribe.sqlite`
  }

  // Settings for Knex
  db      = {
    client:     this.ENV === `test` || this.ENV === `development` ? `sqlite` : `mysql`,
    connection: this.ENV === `test` || this.ENV === `development` ? this.sqlite : this.mysql,
    migrations: {
      directory: `./src/models`,
      tableName: `migrations`
    }
  }
}

export default new Config()
