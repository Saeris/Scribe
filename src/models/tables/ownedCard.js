import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'
import { Card } from './'

@bookshelfOptions
export default class OwnedCard extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
      .primary()
      .unique()

    table.string(`card`)
      .comment(`The card which this is an instance of.`)
      .notNullable()

    // Timestamps
    table.timestamps()
  }

  card = () => this.hasOne(Card, `id`, `card`)
}
