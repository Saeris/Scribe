import db from '../../config/bookshelf.config'

export default class LegalityCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`legality`)
         .comment(`The legality associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`legalitycards_legality`)

    table.bigInteger(`card`)
         .comment(`The card associated with this legality.`)
         .notNullable()
         .unsigned()
         .index(`legalitycards_card`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`legality`, `card`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `legalitycards` }

  get hasTimestamps() { return true }
}
