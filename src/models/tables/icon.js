import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions
export default class Icon extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
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
}
