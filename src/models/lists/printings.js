import db from '../../config/bookshelf.config'

export default class Printings extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this printing.`)
         .notNullable()
         .unsigned()

    table.bigInteger(`printing`)
         .comment(`The printing associated with this card.`)
         .notNullable()
         .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `printing`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `printings` }

  get hasTimestamps() { return true }
}
