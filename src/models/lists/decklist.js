import db from '../../config/bookshelf.config'

export default class Decklist extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`card`)
      .comment(`The card associated with this deck.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`deck`)
      .comment(`The deck associated with this card.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `deck`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `card` }

  get hasTimestamps() { return true }
}
