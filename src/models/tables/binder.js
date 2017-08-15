import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'
import { OwnedCard, Tag } from './'
import { BinderCards, Tags } from '../lists'

@bookshelfOptions
export default class Binder extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
      .primary()
      .unique()

    table.string(`name`)
      .comment(`The name of the binder.`)
      .notNullable()

    table.string(`description`)
      .comment(`A description of the binder.`)
      .notNullable()

    table.integer(`privacy`)
      .comment(`The privacy setting of the binder.`)
      .notNullable()

    // Timestamps
    table.timestamps()
  }

  tags = () => this.hasMany(Tag, `id`).through(Tags, `id`, `tag`, `item`)

  cards = () => this.hasMany(OwnedCard, `id`).through(BinderCards, `id`, `card`, `binder`)
}
