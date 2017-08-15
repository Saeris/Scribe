import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class CategoryCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`category`)
      .comment(`The category associated with this card.`)
      .notNullable()

    table.string(`card`)
      .comment(`The card associated with this category.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`category`, `card`])
  }
}
