import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class Icons extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`layout`)
      .comment(`The layout associated with this icon.`)
      .notNullable()

    table.string(`icon`)
      .comment(`The icon associated with this layout.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`layout`, `icon`])
  }
}
