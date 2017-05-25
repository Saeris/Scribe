import db from '../../config/bookshelf.config'

export default class Language extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
      .notNullable()
      .unsigned()
      .primary()
      .unique()

    table.string(`name`)
      .comment(`The name of the language.`)
      .notNullable()
      .unique()

    table.string(`code`)
      .comment(`The language code associated with the language.`)
      .notNullable()
      .unique()

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `language` }

  get hasTimestamps() { return true }
}
