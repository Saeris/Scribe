import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class Names extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`card`)
      .comment(`The card associated with this name.`)
      .notNullable()

    table.string(`name`)
      .comment(`The name associated with this card.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `name`])
  }
}
