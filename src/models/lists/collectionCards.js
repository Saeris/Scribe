import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class CollectionCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`collection`)
      .comment(`The collection associated with this card.`)
      .notNullable()

    table.string(`card`)
      .comment(`The card associated with this collection.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`collection`, `card`])
  }
}
