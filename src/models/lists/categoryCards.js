import db from '../../config/bookshelf.config'

export default class CategoryCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`category`)
      .comment(`The category associated with this card.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`card`)
      .comment(`The card associated with this category.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`category`, `card`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `categorycards` }

  get hasTimestamps() { return true }
}
