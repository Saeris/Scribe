import db from '../../config/bookshelf.config'

export default class RulingCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`ruling`)
         .comment(`The ruling associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`rulingcards_ruling`)

    table.bigInteger(`card`)
         .comment(`The card associated with this ruling.`)
         .notNullable()
         .unsigned()
         .index(`rulingcards_card`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`ruling`, `card`])
  }

  static foreignKeys(table) {
    table.foreign(`card`)
         .references(`id`)
         .inTable(`card`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `rulingcards` }

  get hasTimestamps() { return true }
}
