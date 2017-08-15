import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'

@bookshelfOptions({ gid: false })
export default class ArtistCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`artist`)
      .comment(`The artist associated with this card.`)
      .notNullable()

    table.string(`card`)
      .comment(`The card associated with this artist.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`artist`, `card`])
  }
}
