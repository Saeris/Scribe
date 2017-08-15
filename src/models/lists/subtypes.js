import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class Subtypes extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`card`)
      .comment(`The card associated with this subtype.`)
      .notNullable()

    table.string(`subtype`)
      .comment(`The subtype associated with this card.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `subtype`])
  }
}
