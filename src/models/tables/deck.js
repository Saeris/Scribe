import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'
import { OwnedCard, Tag } from './'
import { Decklist, Sideboard, Tags } from '../lists'

@bookshelfOptions
export default class Deck extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
      .primary()
      .unique()

    table.string(`name`)
      .comment(`The name of the deck.`)
      .notNullable()

    table.string(`description`)
      .comment(`A description of the deck.`)
      .notNullable()

    table.integer(`privacy`)
      .comment(`The privacy setting of the deck.`)
      .notNullable()

    // Timestamps
    table.timestamps()
  }

  tags = () => this.hasMany(Tag, `id`).through(Tags, `id`, `tag`, `item`)

  decklist = () => this.hasMany(OwnedCard, `id`).through(Decklist, `id`, `card`, `deck`)

  sideboard = () => this.hasMany(OwnedCard, `id`).through(Sideboard, `id`, `card`, `deck`)
}
