import db from '../../config/bookshelf.config'

export default class Booster extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .unsigned()
         .primary()

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `booster` }

  get hasTimestamps() { return true }
}
