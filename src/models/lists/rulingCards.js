import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class RulingCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`ruling`)
      .comment(`The ruling associated with this card.`)
      .notNullable()

    table.string(`card`)
      .comment(`The card associated with this ruling.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`ruling`, `card`])
  }
}
