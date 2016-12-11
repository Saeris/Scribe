import db from '../../config/bookshelf.config'

export default class Icon extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`name`)
         .comment(`The name of the icon.`)
         .notNullable()

    table.text(`image`)
         .comment(`A URL pointing to an image of the icon.`)
         .notNullable()

    table.string(`class`)
         .comment(`CSS class name used to display the icon.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {

  }

  // Bookshelf Relation Definitions
  get tableName() { return 'icon' }

  get hasTimestamps() { return true }
}
