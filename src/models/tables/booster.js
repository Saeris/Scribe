import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions
export default class Booster extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
      .primary()
      .unique()

    // Timestamps
    table.timestamps()
  }
}
