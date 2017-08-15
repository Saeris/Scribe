import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions
export default class Language extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
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
}
