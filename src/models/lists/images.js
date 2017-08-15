import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class Images extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`printing`)
      .comment(`The printing associated with this image.`)
      .notNullable()

    table.string(`image`)
      .comment(`The image associated with this printing.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`printing`, `image`])
  }
}
