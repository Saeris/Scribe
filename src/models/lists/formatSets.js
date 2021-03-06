import db from '../../config/bookshelf.config'

export default class FormatSets extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`format`)
         .comment(`The format associated with this set.`)
         .notNullable()
         .unsigned()
         .index(`formatsets_format`)

    table.bigInteger(`set`)
         .comment(`The set associated with this format.`)
         .notNullable()
         .unsigned()
         .index(`formatsets_set`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`format`, `set`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `formatsets` }

  get hasTimestamps() { return true }
}
