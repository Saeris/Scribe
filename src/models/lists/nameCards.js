import db from '../../config/bookshelf.config'

export default class NameCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`name`)
      .comment(`The name associated with this card.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`card`)
      .comment(`The card associated with this name.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`name`, `card`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `namecards` }

  get hasTimestamps() { return true }
}
