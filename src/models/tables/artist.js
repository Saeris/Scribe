import db from '../../config/bookshelf.config'
import { Card } from './'
import { ArtistCards } from '../lists'

export default class Artist extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .unsigned()
         .primary()

    table.string(`name`)
         .comment(`The name of the artist.`)
         .notNullable()

    table.text(`website`)
         .comment(`The website of the artist, if they have one.`)

    table.bigInteger(`cards`)
         .comment(`The cards associated with this artist.`)
         .unsigned()
         .index(`artist_cards`)

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `artist` }

  get hasTimestamps() { return true }

  cards = () => this.hasMany(Card, `cards`).through(ArtistCards)
}
