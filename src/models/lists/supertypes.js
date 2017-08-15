import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class Supertypes extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`card`)
      .comment(`The card associated with this supertype.`)
      .notNullable()

    table.string(`supertype`)
      .comment(`The supertype associated with this card.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `supertype`])
  }
}
