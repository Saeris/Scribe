import db from '../../config/bookshelf.config'

export default class ArtistCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`artist`)
         .comment(`The artist associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`artistcards_artist`)

    table.bigInteger(`card`)
         .comment(`The card associated with this artist.`)
         .notNullable()
         .unsigned()
         .index(`artistcards_card`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`artist`, `card`])
  }

  static foreignKeys(table) {
    table.foreign(`card`)
         .references(`id`)
         .inTable(`card`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `artistcards` }

  get hasTimestamps() { return true }
}
