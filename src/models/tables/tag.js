import db from '../../config/bookshelf.config'

export default class Tag extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
      .notNullable()
      .unsigned()
      .primary()
      .unique()

    table.string(`tag`)
      .comment(`The text of the tag.`)
      .notNullable()
      .unique()

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `tag` }

  get hasTimestamps() { return true }
}
