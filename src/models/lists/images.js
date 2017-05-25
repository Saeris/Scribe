import db from '../../config/bookshelf.config'

export default class Images extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`printing`)
      .comment(`The printing associated with this image.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`image`)
      .comment(`The image associated with this printing.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`printing`, `image`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `images` }

  get hasTimestamps() { return true }
}
