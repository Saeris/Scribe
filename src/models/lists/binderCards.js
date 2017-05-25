import db from '../../config/bookshelf.config'

export default class BinderCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`binder`)
      .comment(`The binder associated with this card.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`card`)
      .comment(`The card associated with this binder.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`binder`, `card`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `bindercards` }

  get hasTimestamps() { return true }
}
