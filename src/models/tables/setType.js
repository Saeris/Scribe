import db from '../../config/bookshelf.config'

export default class SetType extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
      .notNullable()
      .unsigned()
      .primary()
      .unique()

    table.string(`name`)
      .comment(`The name of the set type.`)
      .notNullable()
      .unique()

    table.text(`description`)
      .comment(`The description of the set type.`)

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `setType` }

  get hasTimestamps() { return true }
}
