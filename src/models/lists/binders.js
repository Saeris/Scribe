import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class Binders extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`binder`)
      .comment(`The binder associated with this collection.`)
      .notNullable()

    table.string(`collection`)
      .comment(`The collection associated with this binder.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`binder`, `collection`])
  }
}
