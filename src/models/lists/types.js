import db from '../../config/bookshelf.config'

export default class Types extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this type.`)
         .notNullable()
         .unsigned()
         .index(`types_card`)

    table.bigInteger(`type`)
         .comment(`The type associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`types_type`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `type`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `types` }

  get hasTimestamps() { return true }
}
