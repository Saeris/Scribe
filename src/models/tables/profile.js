import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions
export default class Profile extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
      .primary()
      .unique()

    table.string(`service`)
      .comment(`The name of the social media service.`)
      .notNullable()

    table.string(`token`)
      .comment(`The access token issued by the social media service.`)
      .notNullable()
      .unique()

    // Timestamps
    table.timestamps()
  }
}
