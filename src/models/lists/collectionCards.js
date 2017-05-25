import db from '../../config/bookshelf.config'

export default class CollectionCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`collection`)
      .comment(`The collection associated with this card.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`card`)
      .comment(`The card associated with this collection.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`collection`, `card`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `collectioncards` }

  get hasTimestamps() { return true }
}
