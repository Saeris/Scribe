import db from '../../config/bookshelf.config'

export default class LegalityCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`legality`)
         .comment(`The legality associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`legality`)

    table.bigInteger(`card`)
         .comment(`The card associated with this legality.`)
         .notNullable()
         .unsigned()
         .index(`card`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`legality`, `card`])
  }

  static foreignKeys(table) {
    table.foreign(`card`)
         .references(`id`)
         .inTable(`card`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return 'legalitycards' }

  get hasTimestamps() { return true }
}
