import db from '../../config/bookshelf.config'

export default class Categories extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`card`)
      .comment(`The card associated with this category.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`category`)
      .comment(`The category associated with this card.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `category`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `categories` }

  get hasTimestamps() { return true }
}
