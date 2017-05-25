import db from '../../config/bookshelf.config'

export default class RulingCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`ruling`)
      .comment(`The ruling associated with this card.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`card`)
      .comment(`The card associated with this ruling.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`ruling`, `card`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `rulingcards` }

  get hasTimestamps() { return true }
}
