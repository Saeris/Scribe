import dotenv  from 'dotenv' // https://github.com/motdotla/dotenv
import Winston from 'winston' // https://github.com/winstonjs/winston
import 'winston-loggly-bulk' // https://github.com/loggly/winston-loggly-bulk

dotenv.config()

class Config {
  env = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || (process.env.NODE_ENV === `development`)

  getDBClient = () => {
    if (!!process.env.USE_DB) {
      const db = process.env.USE_DB.toLowerCase()
      if (db === `mysql`) return db
      if (db === `sqlite`) return db
    }
    return this.env === `production` ? `mysql` : `sqlite`
  }

  // HTTP Server Settings
  http = {
    host: `127.0.0.1`,
    port: process.env.HTTP || 1337,
    routes: {
      cors: true
    }
  }

  // HTTPS Server Settings
  https = {
    host: `127.0.0.1`,
    port: process.env.HTTPS || 8080,
    routes: {
      cors: true
    }
  }

  // Define Cron Jobs
  cron = {
    jobs: [/*{
      name: `testcron`,
      time: `*\/6 * * * * *`,
      timezone: `America/Los_Angeles`,
      request: {
        method: `GET`,
        url: `/graphiql`
      },
      callback: (res) => console.info(`testcron has run!`)
    }*/]
  }

  // Define Content Security Policy Settings
  csp = {}

  error = {
    statusCodes: {
      '400': { redirect: `/graphiql` }, // bad request
      '401': { redirect: `/graphiql` }, // unauthorized
      '403': { redirect: `/graphiql` }, // forbidden
      '404': { redirect: `/graphiql` }, // not found
      '408': { redirect: `/graphiql` }, // request timeout
      '418': { redirect: `/graphiql` }, // teapot
      '429': { redirect: `/graphiql` }, // too many requests
      '500': { redirect: `/graphiql` }, // internal server error
      '502': { redirect: `/graphiql` }, // bad gateway
      '503': { redirect: `/graphiql` }, // service unavailable
      '504': { redirect: `/graphiql` }  // gateway timeout
    }
  }

  // Sets the server's log level
  level = process.env.LOGLEVEL || `info`

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
        humanReadableUnhandledException: true,
        json:             false,
        colorize:         true
      })
    ]
  }

  // Good Logger Settings
  good = {
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
  mysql = {
    host:     process.env.DB_HOST || `127.0.0.1`,
    user:     process.env.DB_USERNAME || `root`,
    password: process.env.DB_PASSWORD || `password`,
    database: process.env.DB_NAME || `scribe`,
    charset:  `utf8`
  }

  // Settings for SQLite3 Database
  sqlite = {
    filename: `./src/scribe.sqlite`
  }

  // Settings for Knex
  db = {
    client:     (this.getDBClient)(),
    connection: this[(this.getDBClient)()],
    migrations: {
      directory: `./src/models`,
      tableName: `migrations`
    },
    useNullAsDefault: this.env === `test` || this.env === `development` ? true : false
  }

  redis = {
    host: process.env.REDIS_HOST || `127.0.0.1`,
    port: process.env.REDIS_PORT || 6379
  }

  rateLimit = client => ({
    redisClient: client,
    rateLimitKey: request => `${request.info.remoteAddress}`,
    overLimitError: rate => new Error(`Rate Limit Exceeded - try again in ${rate.window} seconds`)
  })
}

export default new Config()
