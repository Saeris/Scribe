import db from '../../config/bookshelf.config'

export default class Icons extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`layout`)
      .comment(`The layout associated with this icon.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`icon`)
      .comment(`The icon associated with this layout.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`layout`, `icon`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `icons` }

  get hasTimestamps() { return true }
}
