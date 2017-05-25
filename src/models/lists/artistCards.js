import db from '../../config/bookshelf.config'

export default class ArtistCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`artist`)
      .comment(`The artist associated with this card.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`card`)
      .comment(`The card associated with this artist.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`artist`, `card`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `artistcards` }

  get hasTimestamps() { return true }
}
