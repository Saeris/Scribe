import db from '../../config/bookshelf.config'
import { Card } from './'

export default class OwnedCard extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
      .notNullable()
      .unsigned()
      .primary()
      .unique()

    table.bigInteger(`card`)
      .comment(`The card which this is an instance of.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `ownedCard` }

  get hasTimestamps() { return true }

  card = () => this.hasOne(Card, `id`, `card`)
}
