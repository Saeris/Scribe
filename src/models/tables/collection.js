import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'
import { Binder, Deck, OwnedCard, User } from './'
import { Binders, Decks, CollectionCards } from '../lists'

@bookshelfOptions
export default class Collection extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
      .primary()
      .unique()

    table.string(`owner`)
      .comment(`The owner of this collection.`)
      .notNullable()
      .unique()

    // Timestamps
    table.timestamps()
  }

  owner = () => this.hasOne(User, `id`, `owner`)

  cards = () => this.hasMany(OwnedCard, `id`).through(CollectionCards, `id`, `card`, `collection`)

  binders = () => this.hasMany(Binder, `id`).through(Binders, `id`, `binder`, `collection`)

  decks = () => this.hasMany(Deck, `id`).through(Decks, `id`, `deck`, `collection`)
}
