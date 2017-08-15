import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class KeywordCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`keyword`)
      .comment(`The keyword associated with this card.`)
      .notNullable()

    table.string(`card`)
      .comment(`The card associated with this keyword.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`keyword`, `card`])
  }
}
