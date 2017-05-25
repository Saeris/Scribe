import db from '../../config/bookshelf.config'

export default class Icon extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .unsigned()
         .primary()
         .unique()

    table.string(`name`)
         .comment(`The name of the icon.`)
         .notNullable()

    table.text(`image`)
         .comment(`A URL pointing to an image of the icon.`)

    table.string(`class`)
         .comment(`CSS class name used to display the icon.`)

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `icon` }

  get hasTimestamps() { return true }
}
