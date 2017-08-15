import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions
export default class Rarity extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
      .primary()
      .unique()

    table.string(`name`)
      .comment(`The name of the rarity.`)
      .notNullable()
      .unique()

    table.string(`class`)
      .comment(`CSS class name used to display the rarity.`)
      .notNullable()

    // Timestamps
    table.timestamps()
  }
}
