import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class Decklist extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`card`)
      .comment(`The card associated with this deck.`)
      .notNullable()

    table.string(`deck`)
      .comment(`The deck associated with this card.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `deck`])
  }
}
