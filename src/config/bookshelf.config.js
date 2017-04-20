import knex from 'knex'// http://knexjs.org/
import bookshelf from 'bookshelf' // http://bookshelfjs.org/
import modelbase from 'bookshelf-modelbase' // https://github.com/bsiddiqui/bookshelf-modelbase
import mbExtended from '../utilities/modelbase-extended'
import config from './server.config'

const db = bookshelf(knex(config.db))

db.plugin(modelbase.pluggable)
db.plugin(`registry`) // https://github.com/tgriesser/bookshelf/wiki/Plugin:-Model-Registry
db.plugin(`visibility`) // https://github.com/tgriesser/bookshelf/wiki/Plugin:-Visibility
db.plugin(`pagination`) // https://github.com/tgriesser/bookshelf/wiki/Plugin:-Pagination
db.plugin(mbExtended)

console.log(`✓ Bookshelf configured using: ${config.db.client}`)

export default db
