import db from '../../config/bookshelf.config'

export default class Rulings extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`card`)
      .comment(`The card associated with this ruling.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`ruling`)
      .comment(`The ruling associated with this card.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `ruling`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `rulings` }

  get hasTimestamps() { return true }
}
