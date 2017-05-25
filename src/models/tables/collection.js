import db from '../../config/bookshelf.config'
import { Binder, Deck, OwnedCard, User } from './'
import { Binders, Decks, CollectionCards } from '../lists'

export default class Collection extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
      .notNullable()
      .unsigned()
      .primary()
      .unique()

    table.bigInteger(`owner`)
      .comment(`The owner of this collection.`)
      .notNullable()
      .unsigned()
      .unique()

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `collection` }

  get hasTimestamps() { return true }

  owner = () => this.hasOne(User, `id`, `owner`)

  cards = () => this.hasMany(OwnedCard, `id`).through(CollectionCards, `id`, `card`, `collection`)

  binders = () => this.hasMany(Binder, `id`).through(Binders, `id`, `binder`, `collection`)

  decks = () => this.hasMany(Deck, `id`).through(Decks, `id`, `deck`, `collection`)
}
