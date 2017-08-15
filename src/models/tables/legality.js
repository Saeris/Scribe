import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'
import { Format, Card } from './'

@bookshelfOptions
export default class Legality extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Indexes
    table.string(`id`)
      .notNullable()
      .primary()
      .unique()

    // Fields
    table.string(`format`)
      .comment(`The format associated with this legality.`)
      .notNullable()

    table.boolean(`legal`)
      .comment(`True if the card is legal in the associated format.`)
      .notNullable()

    table.boolean(`restricted`)
      .comment(`True if the card is restricted in the associated format.`)
      .notNullable()

    // Timestamps
    table.timestamps()
  }

  format = () => this.hasOne(Format, `format`)

  cards = () => this.belongsToMany(Card, `cards`)
}
