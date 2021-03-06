import db from '../../config/bookshelf.config'

export default class Supertypes extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this supertype.`)
         .notNullable()
         .unsigned()
         .index(`supertypes_card`)

    table.bigInteger(`supertype`)
         .comment(`The supertype associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`supertypes_supertype`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `supertype`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `supertypes` }

  get hasTimestamps() { return true }
}
