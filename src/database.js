import knex from "knex"// http://knexjs.org/
import bookshelf from 'bookshelf' // http://bookshelfjs.org/
import modelbase from 'bookshelf-modelbase' // https://github.com/bsiddiqui/bookshelf-modelbase
import paranoia from 'bookshelf-paranoia' // https://github.com/estate/bookshelf-paranoia
import { bookshelfGlobalID } from '@/utilities'

const isProd = ENV === `production`

export const config = {
  client: isProd ? `mysql` : `sqlite`,
  connection: isProd
    ? {
      host: DB_HOST || `127.0.0.1`,
      user: DB_USERNAME || `root`,
      password: DB_PASSWORD || `password`,
      database: DB_NAME || `scribe`,
      charset: `utf8`
    }
    : { filename: `./database.sqlite` },
  migrations: {
    directory: `./scripts/migrations`,
    tableName: `migrations`
  },
  useNullAsDefault: true,
  debug: true
}

export const database = knex(config)

export const orm = bookshelf(database)

orm.plugin(bookshelfGlobalID)
orm.plugin(modelbase.pluggable)
orm.plugin(`registry`) // https://github.com/tgriesser/bookshelf/wiki/Plugin:-Model-Registry
orm.plugin(`visibility`) // https://github.com/tgriesser/bookshelf/wiki/Plugin:-Visibility
orm.plugin(`pagination`) // https://github.com/tgriesser/bookshelf/wiki/Plugin:-Pagination
orm.plugin(paranoia, { field: `deleted`, sentinel: `active` })


export const { Model } = orm

export default database
