import db from '../../config/bookshelf.config'
import { OwnedCard, Tag } from './'
import { BinderCards, Tags } from '../lists'

export default class Binder extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
      .notNullable()
      .unsigned()
      .primary()
      .unique()

    table.string(`name`)
      .comment(`The name of the binder.`)
      .notNullable()

    table.bigInteger(`description`)
      .comment(`A description of the binder.`)
      .notNullable()

    table.integer(`privacy`)
      .comment(`The privacy setting of the binder.`)
      .notNullable()

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `binder` }

  get hasTimestamps() { return true }

  tags = () => this.hasMany(Tag, `id`).through(Tags, `id`, `tag`, `item`)

  cards = () => this.hasMany(OwnedCard, `id`).through(BinderCards, `id`, `card`, `binder`)
}
