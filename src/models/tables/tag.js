import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions
export default class Tag extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
      .primary()
      .unique()

    table.string(`tag`)
      .comment(`The text of the tag.`)
      .notNullable()
      .unique()

    // Timestamps
    table.timestamps()
  }
}
