import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class Tags extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`item`)
      .comment(`The item associated with this tag.`)
      .notNullable()

    table.string(`tag`)
      .comment(`The tag associated with this item.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`item`, `tag`])
  }
}
