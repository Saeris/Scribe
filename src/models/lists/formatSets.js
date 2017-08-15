import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class FormatSets extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`format`)
      .comment(`The format associated with this set.`)
      .notNullable()

    table.string(`set`)
      .comment(`The set associated with this format.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`format`, `set`])
  }
}
