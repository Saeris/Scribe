import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class Decks extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`deck`)
      .comment(`The deck associated with this collection.`)
      .notNullable()

    table.string(`collection`)
      .comment(`The collection associated with this deck.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`deck`, `collection`])
  }
}
