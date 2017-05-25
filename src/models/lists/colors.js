import db from '../../config/bookshelf.config'

export default class Colors extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`coloridentity`)
      .comment(`The colorIdentity associated with the color.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`color`)
      .comment(`The color associated with the colorIdentity.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`coloridentity`, `color`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `colors` }

  get hasTimestamps() { return true }
}
