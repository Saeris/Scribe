import db from '../../config/bookshelf.config'

export default class Variations extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`card`)
      .comment(`The card associated with this variation.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`variation`)
      .comment(`The variation associated with this card.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `variation`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `variations` }

  get hasTimestamps() { return true }
}
