import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class Profiles extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`profile`)
      .comment(`The profile associated with this user.`)
      .notNullable()

    table.string(`user`)
      .comment(`The user associated with this profile.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`profile`, `user`])
  }
}
