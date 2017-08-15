import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class LegalityCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`legality`)
      .comment(`The legality associated with this card.`)
      .notNullable()

    table.string(`card`)
      .comment(`The card associated with this legality.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`legality`, `card`])
  }
}
