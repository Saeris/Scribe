import db from '../../config/bookshelf.config'

export default class Binders extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`binder`)
      .comment(`The binder associated with this collection.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`collection`)
      .comment(`The collection associated with this binder.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`binder`, `collection`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `binders` }

  get hasTimestamps() { return true }
}
