import db from '../../config/bookshelf.config'

export default class Supertype extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .unsigned()
         .primary()

    table.string(`name`)
         .comment(`The name of the supertype.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `supertype` }

  get hasTimestamps() { return true }
}
