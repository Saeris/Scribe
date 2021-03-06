import db from '../../config/bookshelf.config'

export default class Subtypes extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this subtype.`)
         .notNullable()
         .unsigned()
         .index(`subtypes_card`)

    table.bigInteger(`subtype`)
         .comment(`The subtype associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`subtypes_subtype`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `subtype`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `subtypes` }

  get hasTimestamps() { return true }
}
