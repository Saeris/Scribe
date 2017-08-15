import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'
import { Set } from './'

@bookshelfOptions
export default class Format extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
      .primary()
      .unique()

    table.string(`name`)
      .comment(`The name of the format.`)
      .notNullable()
      .unique()

    // Timestamps
    table.timestamps()
  }

  sets = () => this.hasMany(Set, `sets`)
}
