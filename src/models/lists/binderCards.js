import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class BinderCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`binder`)
      .comment(`The binder associated with this card.`)
      .notNullable()

    table.string(`card`)
      .comment(`The card associated with this binder.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`binder`, `card`])
  }
}
