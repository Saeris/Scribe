import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class Printings extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`card`)
      .comment(`The card associated with this printing.`)
      .notNullable()

    table.string(`printing`)
      .comment(`The printing associated with this card.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `printing`])
  }
}
