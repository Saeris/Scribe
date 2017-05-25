import db from '../../config/bookshelf.config'
import { OwnedCard, Tag } from './'
import { Decklist, Sideboard, Tags } from '../lists'

export default class Deck extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
      .notNullable()
      .unsigned()
      .primary()
      .unique()

    table.string(`name`)
      .comment(`The name of the deck.`)
      .notNullable()

    table.bigInteger(`description`)
      .comment(`A description of the deck.`)
      .notNullable()
      .unsigned()

    table.integer(`privacy`)
      .comment(`The privacy setting of the deck.`)
      .notNullable()

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `deck` }

  get hasTimestamps() { return true }

  tags = () => this.hasMany(Tag, `id`).through(Tags, `id`, `tag`, `item`)

  decklist = () => this.hasMany(OwnedCard, `id`).through(Decklist, `id`, `card`, `deck`)

  sideboard = () => this.hasMany(OwnedCard, `id`).through(Sideboard, `id`, `card`, `deck`)
}
