import db from '../../config/bookshelf.config'

export default class Names extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this name.`)
         .notNullable()
         .unsigned()
         .index(`names_card`)

    table.bigInteger(`name`)
         .comment(`The name associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`names_name`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `name`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `names` }

  get hasTimestamps() { return true }
}
