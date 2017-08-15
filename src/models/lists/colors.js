import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class Colors extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`colorIdentity`)
      .comment(`The colorIdentity associated with the color.`)
      .notNullable()

    table.string(`color`)
      .comment(`The color associated with the colorIdentity.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`colorIdentity`, `color`])
  }
}
