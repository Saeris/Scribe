import db from '../../config/bookshelf.config'

export default class Legalities extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`card`)
      .comment(`The card associated with this legality.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`legality`)
      .comment(`The legality associated with this card.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `legality`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `legalities` }

  get hasTimestamps() { return true }
}
