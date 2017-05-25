import db from '../../config/bookshelf.config'

export default class Tags extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`item`)
      .comment(`The item associated with this tag.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`tag`)
      .comment(`The tag associated with this item.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`item`, `tag`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `tags` }

  get hasTimestamps() { return true }
}
