import db from '../../config/bookshelf.config'

export default class formatSets extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`format`)
         .comment(`The format associated with this set.`)
         .notNullable()
         .unsigned()
         .index(`format`)

    table.bigInteger(`set`)
         .comment(`The set associated with this format.`)
         .notNullable()
         .unsigned()
         .index(`set`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`format`, `set`])
  }

  static foreignKeys(table) {
    table.foreign(`set`)
         .references(`id`)
         .inTable(`set`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return 'formatsets' }

  get hasTimestamps() { return true }
}
