import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'
import { Card } from './'
import { ArtistCards } from '../lists'

@bookshelfOptions
export default class Artist extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
      .primary()
      .unique()

    table.string(`name`)
      .comment(`The name of the artist.`)
      .notNullable()
      .unique()

    table.text(`website`)
      .comment(`The website of the artist, if they have one.`)

    // Timestamps
    table.timestamps()
  }

  cards = () => this.hasMany(Card, `id`).through(ArtistCards, `id`, `card`, `artist`)
}
