import db from '../../config/bookshelf.config'

export default class Decks extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`deck`)
      .comment(`The deck associated with this collection.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`collection`)
      .comment(`The collection associated with this deck.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`deck`, `collection`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `decks` }

  get hasTimestamps() { return true }
}
