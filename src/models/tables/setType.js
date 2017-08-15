import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions
export default class SetType extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
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
}
