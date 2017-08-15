import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class BlockSets extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`block`)
      .comment(`The block associated with this set.`)
      .notNullable()

    table.string(`set`)
      .comment(`The set associated with this block.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`block`, `set`])
  }
}
