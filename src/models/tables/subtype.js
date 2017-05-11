import db from '../../config/bookshelf.config'

export default class Subtype extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .unsigned()
         .primary()

    table.string(`name`)
         .comment(`The name of the subtype.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `subtype` }

  get hasTimestamps() { return true }
}
